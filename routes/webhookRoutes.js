const AuthService = require("../services/authService");
const GTMService = require("../services/gtmService");
const GAService = require("../services/gaService");
const Migration = require("../models/migration");
const MondayService = require("../services/mondayService");
const crypto = require("crypto");

class WebhookController {
  static verifyMondaySignature(req) {
    if (!process.env.MONDAY_WEBHOOK_SECRET) {
      console.warn("WARNING: MONDAY_WEBHOOK_SECRET not set - skipping signature verification");
      return true;
    }

    const signature = req.headers["authorization"];
    if (!signature) return false;

    const body = JSON.stringify(req.body);
    const hash = crypto.createHmac("sha256", process.env.MONDAY_WEBHOOK_SECRET).update(body).digest("hex");

    return signature === hash;
  }

  static async handleMondayWebhook(req, res) {
    let mondayService;
    let boardId, itemId, statusColumnId;

    try {
      // Log the incoming webhook for debugging
      console.log("=== Monday.com Webhook Received ===");
      console.log("Headers:", JSON.stringify(req.headers, null, 2));
      console.log("Body:", JSON.stringify(req.body, null, 2));

      // Verify signature
      if (!WebhookController.verifyMondaySignature(req)) {
        console.error("Invalid webhook signature");
        return res.status(401).json({
          success: false,
          error: "Invalid signature",
        });
      }

      // Initialize Monday service
      mondayService = new MondayService();

      // Extract data from webhook payload
      const payload = req.body;

      // Handle different webhook formats
      let webhookData;

      if (payload.event) {
        // Standard Monday webhook format
        webhookData = payload.event;
      } else if (payload.challenge) {
        // Challenge verification
        return res.json({ challenge: payload.challenge });
      } else {
        // Direct payload format
        webhookData = payload;
      }

      // Extract essential identifiers
      boardId = webhookData.boardId || webhookData.board_id || payload.boardId;
      itemId = webhookData.pulseId || webhookData.itemId || webhookData.item_id || payload.itemId;

      if (!boardId || !itemId) {
        console.error("Missing boardId or itemId in webhook payload");
        return res.status(400).json({
          success: false,
          error: "Missing boardId or itemId",
          receivedPayload: payload,
        });
      }

      console.log(`Processing item ${itemId} from board ${boardId}`);

      // Fetch full item data from Monday.com
      const itemData = await mondayService.getItemData(boardId, itemId);
      console.log("Item data fetched:", JSON.stringify(itemData, null, 2));

      // Parse column values
      const columnData = mondayService.parseColumnValues(itemData.column_values);
      console.log("Parsed column data:", JSON.stringify(columnData, null, 2));

      // Extract migration data - flexible column ID mapping
      const extractField = (possibleKeys) => {
        for (const key of possibleKeys) {
          const value = mondayService.extractValue(columnData, key);
          if (value) return value;
        }
        return null;
      };

      const clientName = extractField(["client_name", "client", "name", "text", "item_name"]) || itemData.name;

      const moveType = extractField(["operation_type", "operation", "type", "move_type", "action"]);

      const newEmail = extractField(["new_user_email", "new_email", "email", "user_email", "new_user"]);

      const offboardEmail = extractField(["offboard_email", "offboard", "archive_email"]);

      const gaAccountId = extractField(["ga_account_id", "ga_id", "google_analytics_id", "analytics_id"]);

      const gtmAccountId = extractField(["gtm_account_id", "gtm_id", "tag_manager_id", "tagmanager_id"]);

      const gtmContainerId = extractField(["gtm_container_id", "container_id", "gtm_container"]);

      statusColumnId = "status"; // Default, can be overridden

      // Find status column ID
      const statusColumn = itemData.column_values.find((col) => col.id.includes("status") || col.id.includes("dup__"));
      if (statusColumn) {
        statusColumnId = statusColumn.id;
      }

      console.log("Extracted migration data:", {
        clientName,
        moveType,
        newEmail,
        offboardEmail,
        gaAccountId,
        gtmAccountId,
        gtmContainerId,
      });

      // Validation
      if (!clientName) {
        throw new Error("Client name is required but not found in webhook data");
      }

      if (!moveType || !["migration", "offboard"].includes(moveType.toLowerCase())) {
        throw new Error(`Invalid move type: ${moveType}. Must be "migration" or "offboard"`);
      }

      const normalizedMoveType = moveType.toLowerCase();

      if (normalizedMoveType === "migration" && !newEmail) {
        throw new Error("New email is required for migration type");
      }

      if (normalizedMoveType === "offboard" && !offboardEmail) {
        throw new Error("Offboard email is required for offboard type");
      }

      if (!gaAccountId && !gtmAccountId) {
        throw new Error("At least one account ID (GA or GTM) is required");
      }

      // Update Monday status to "Processing"
      console.log("Updating Monday status to Processing...");
      await mondayService.updateStatus(boardId, itemId, statusColumnId, "Processing");

      // Create migration data
      const migrationData = {
        clientName,
        moveType: normalizedMoveType,
        newEmail: normalizedMoveType === "migration" ? newEmail : null,
        offboardEmail: normalizedMoveType === "offboard" ? offboardEmail : null,
        gaAccountId,
        gtmAccountId,
        gtmContainerId,
      };

      // Execute migration using existing controller logic
      const result = await WebhookController.executeMigration(migrationData);

      console.log("Migration completed successfully:", result);

      // Update Monday with success
      const successColumns = {
        migration_id: result.moveId.toString(),
        agency_account: result.agencyAccount,
      };

      // Try to find and update additional columns
      const migrationIdColumn = itemData.column_values.find(
        (col) => col.id.includes("migration") || col.id.includes("move_id")
      );
      const agencyColumn = itemData.column_values.find(
        (col) => col.id.includes("agency") || col.id.includes("account")
      );

      if (migrationIdColumn) successColumns[migrationIdColumn.id] = result.moveId.toString();
      if (agencyColumn) successColumns[agencyColumn.id] = result.agencyAccount;

      await mondayService.updateStatus(boardId, itemId, statusColumnId, "Completed", successColumns);

      console.log("Monday board updated with success");

      res.json({
        success: true,
        moveId: result.moveId,
        agencyAccount: result.agencyAccount,
        message: "Migration completed and Monday board updated",
      });
    } catch (error) {
      console.error("Webhook processing error:", error);

      // Try to update Monday with failure
      if (mondayService && boardId && itemId && statusColumnId) {
        try {
          const errorColumn = {};
          const errorCol = await mondayService
            .getItemData(boardId, itemId)
            .then((item) => item.column_values.find((col) => col.id.includes("error") || col.id.includes("message")));

          if (errorCol) {
            errorColumn[errorCol.id] = error.message;
          }

          await mondayService.updateStatus(boardId, itemId, statusColumnId, "Failed", errorColumn);
          console.log("Monday board updated with failure");
        } catch (updateError) {
          console.error("Failed to update Monday with error:", updateError);
        }
      }

      res.status(500).json({
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }

  // Reuse migration logic from UserController
  static async executeMigration(migrationData) {
    let moveId;

    try {
      const { clientName, moveType, newEmail, offboardEmail, gaAccountId, gtmAccountId, gtmContainerId } =
        migrationData;

      // Create migration record
      moveId = await Migration.create({
        clientName,
        moveType,
        newEmail,
        offboardEmail,
        gaAccountId,
        gtmAccountId,
        gtmContainerId,
      });

      console.log(`[Migration ${moveId}] Started ${moveType} for client: ${clientName}`);

      // Find account with access
      const agencyEmail = await AuthService.findAccountWithAccess(gtmAccountId, gaAccountId);

      console.log(`[Migration ${moveId}] Found access via: ${agencyEmail}`);

      const authClient = AuthService.getAuthClient(agencyEmail);

      const results = {
        moveId,
        agencyAccount: agencyEmail,
        gtm: {},
        ga: {},
        warnings: [],
      };

      let oldEmail = null;

      // Check capacity before proceeding
      const capacityWarnings = await UserController.checkAccountCapacity(
        authClient,
        agencyEmail,
        gtmAccountId,
        gaAccountId
      );
      results.warnings = capacityWarnings;

      // Find old user to remove
      if (gtmAccountId) {
        const gtmUsers = await GTMService.findAllUsers(authClient, gtmAccountId);
        const oldGtmUser = gtmUsers.find(
          (u) => u.emailAddress !== newEmail && !u.emailAddress.includes("agency") && u.emailAddress !== offboardEmail
        );

        if (oldGtmUser) {
          oldEmail = oldGtmUser.emailAddress;
        }
      }

      if (!oldEmail && gaAccountId) {
        const gaUsers = await GAService.findAllUsers(authClient, gaAccountId);
        const oldGaUser = gaUsers.find(
          (u) =>
            u.userRef.email !== newEmail && !u.userRef.email.includes("agency") && u.userRef.email !== offboardEmail
        );

        if (oldGaUser) {
          oldEmail = oldGaUser.userRef.email;
        }
      }

      // Remove old user
      if (oldEmail) {
        console.log(`[Migration ${moveId}] Removing old user: ${oldEmail}`);

        if (gtmAccountId) {
          results.gtm.remove = await GTMService.removeUser(authClient, gtmAccountId, oldEmail);
        }

        if (gaAccountId) {
          results.ga.remove = await GAService.removeUser(authClient, gaAccountId, oldEmail);
        }
      }

      // Add new user or offboard email
      if (moveType === "migration" && newEmail) {
        console.log(`[Migration ${moveId}] Adding new user: ${newEmail}`);

        if (gtmAccountId) {
          results.gtm.add = await GTMService.addUser(authClient, gtmAccountId, gtmContainerId, newEmail);
        }

        if (gaAccountId) {
          results.ga.add = await GAService.addUser(authClient, gaAccountId, newEmail);
        }
      } else if (moveType === "offboard" && offboardEmail) {
        console.log(`[Migration ${moveId}] Adding offboard account: ${offboardEmail}`);

        if (gtmAccountId) {
          results.gtm.addOffboard = await GTMService.addUser(authClient, gtmAccountId, gtmContainerId, offboardEmail);
        }

        if (gaAccountId) {
          results.ga.addOffboard = await GAService.addUser(authClient, gaAccountId, offboardEmail);
        }
      }

      // Update migration record
      await Migration.updateStatus(moveId, "completed", {
        oldLocation: oldEmail || "None found",
        newLocation: moveType === "migration" ? newEmail : null,
        offboardLocation: moveType === "offboard" ? offboardEmail : null,
      });

      console.log(`[Migration ${moveId}] Completed successfully`);

      return results;
    } catch (error) {
      if (moveId) {
        await Migration.updateStatus(moveId, "failed", {
          errorMessage: error.message,
        });
      }
      throw error;
    }
  }
}

module.exports = WebhookController;
