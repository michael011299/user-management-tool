const AuthService = require("../services/authService");
const GTMService = require("../services/gtmService");
const GAService = require("../services/gaService");
const Migration = require("../models/migration");

class UserController {
  static async findAccount(req, res) {
    try {
      const { clientName, gaAccountId, gtmAccountId } = req.body;

      if (!clientName && !gaAccountId && !gtmAccountId) {
        return res.status(400).json({
          success: false,
          error: "At least one search criteria is required (clientName, gaAccountId, or gtmAccountId)",
        });
      }

      let agencyEmail = null;
      let matchedBy = null;

      // First, try to find by account IDs if provided
      if (gtmAccountId || gaAccountId) {
        try {
          agencyEmail = await AuthService.findAccountWithAccess(gtmAccountId, gaAccountId);
          matchedBy = "Account ID";
        } catch (error) {
          // If not found by ID and client name provided, try searching by client name
          if (clientName) {
            console.log("Account not found by ID, searching by client name...");
          } else {
            throw error;
          }
        }
      }

      // If not found by ID or no ID provided, search by client name
      if (!agencyEmail && clientName) {
        const result = await AuthService.findAccountByClientName(clientName, gtmAccountId, gaAccountId);
        agencyEmail = result.email;
        matchedBy = "Client Name";
      }

      if (!agencyEmail) {
        return res.status(404).json({
          success: false,
          error: "No account found with access to the specified resources",
        });
      }

      const authClient = AuthService.getAuthClient(agencyEmail);

      const result = {
        success: true,
        agencyAccount: agencyEmail,
        matchedBy: matchedBy,
        users: {},
      };

      // Get all users from GTM
      if (gtmAccountId) {
        try {
          const gtmUsers = await GTMService.findAllUsers(authClient, gtmAccountId);
          result.users.gtm = gtmUsers.map((u) => ({
            email: u.emailAddress,
            permission: u.accountAccess?.permission,
          }));
        } catch (error) {
          console.error("Error fetching GTM users:", error.message);
          result.users.gtm = [];
        }
      }

      // Get all users from GA
      if (gaAccountId) {
        try {
          const gaUsers = await GAService.findAllUsers(authClient, gaAccountId);
          result.users.ga = gaUsers.map((u) => ({
            email: u.userRef.email,
            permissions: u.permissions?.local || [],
          }));
        } catch (error) {
          console.error("Error fetching GA users:", error.message);
          result.users.ga = [];
        }
      }

      res.json(result);
    } catch (error) {
      console.error("Find account error:", error.message);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async processUserMigration(req, res) {
    let moveId;

    try {
      const { clientName, moveType, newEmail, offboardEmail, gaAccountId, gtmAccountId, gtmContainerId } = req.body;

      // Validation
      if (!clientName) {
        return res.status(400).json({
          success: false,
          error: "Client name is required",
        });
      }

      if (!moveType || !["offboard", "migration"].includes(moveType)) {
        return res.status(400).json({
          success: false,
          error: 'Move type must be either "offboard" or "migration"',
        });
      }

      if (moveType === "migration" && !newEmail) {
        return res.status(400).json({
          success: false,
          error: "New email is required for migration",
        });
      }

      if (moveType === "offboard" && !offboardEmail) {
        return res.status(400).json({
          success: false,
          error: "Offboard email is required for offboard type",
        });
      }

      if (!gaAccountId && !gtmAccountId) {
        return res.status(400).json({
          success: false,
          error: "At least one account ID (GA or GTM) is required",
        });
      }

      // STEP 1: Create migration record
      moveId = await Migration.create({
        clientName,
        moveType,
        newEmail,
        offboardEmail: moveType === "offboard" ? offboardEmail : null,
        gaAccountId,
        gtmAccountId,
        gtmContainerId,
      });

      console.log(`[Migration ${moveId}] Started ${moveType} for client: ${clientName}`);

      // STEP 2: Find account with access
      const agencyEmail = await AuthService.findAccountWithAccess(gtmAccountId, gaAccountId);

      console.log(`[Migration ${moveId}] Found access via: ${agencyEmail}`);

      const authClient = AuthService.getAuthClient(agencyEmail);

      const results = {
        moveId,
        agencyAccount: agencyEmail,
        gtm: {},
        ga: {},
      };

      let oldEmail = null;

      // STEP 3: Find old user to remove
      console.log(`[Migration ${moveId}] Searching for old users to remove...`);

      if (gtmAccountId) {
        const gtmUsers = await GTMService.findAllUsers(authClient, gtmAccountId);
        const oldGtmUser = gtmUsers.find(
          (u) =>
            u.emailAddress !== newEmail &&
            !u.emailAddress.includes("agency") &&
            u.emailAddress !== (moveType === "offboard" ? offboardEmail : null)
        );

        if (oldGtmUser) {
          oldEmail = oldGtmUser.emailAddress;
        }
      }

      if (!oldEmail && gaAccountId) {
        const gaUsers = await GAService.findAllUsers(authClient, gaAccountId);
        const oldGaUser = gaUsers.find(
          (u) =>
            u.userRef.email !== newEmail &&
            !u.userRef.email.includes("agency") &&
            u.userRef.email !== (moveType === "offboard" ? offboardEmail : null)
        );

        if (oldGaUser) {
          oldEmail = oldGaUser.userRef.email;
        }
      }

      // STEP 4: Remove old user from GTM/GA
      if (oldEmail) {
        console.log(`[Migration ${moveId}] Removing old user: ${oldEmail}`);

        if (gtmAccountId) {
          results.gtm.remove = await GTMService.removeUser(authClient, gtmAccountId, oldEmail);
        }

        if (gaAccountId) {
          results.ga.remove = await GAService.removeUser(authClient, gaAccountId, oldEmail);
        }
      }

      // STEP 5: Add new user (only for migration) or offboard email (only for offboard)
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

      // STEP 6: Update migration record with success
      await Migration.updateStatus(moveId, "completed", {
        oldLocation: oldEmail || "None found",
        newLocation: moveType === "migration" ? newEmail : null,
        offboardLocation: moveType === "offboard" ? offboardEmail : null,
      });

      console.log(`[Migration ${moveId}] Completed successfully`);

      res.json({
        success: true,
        results,
      });
    } catch (error) {
      console.error(`[Migration ${moveId || "unknown"}] Error:`, error.message);

      if (moveId) {
        await Migration.updateStatus(moveId, "failed", {
          errorMessage: error.message,
        });
      }

      res.status(500).json({
        success: false,
        error: error.message,
        moveId,
      });
    }
  }

  static async getMigrationHistory(req, res) {
    try {
      const { limit, clientName } = req.query;

      let migrations;
      if (clientName) {
        migrations = await Migration.getByClient(clientName);
      } else {
        migrations = await Migration.getAll(limit ? parseInt(limit) : 100);
      }

      res.json({
        success: true,
        count: migrations.length,
        data: migrations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getMigrationById(req, res) {
    try {
      const { id } = req.params;
      const migration = await Migration.getById(id);

      if (!migration) {
        return res.status(404).json({
          success: false,
          error: "Migration not found",
        });
      }

      res.json({
        success: true,
        data: migration,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async getAccountStats(req, res) {
    try {
      console.log("Fetching account statistics...");

      const emails = AuthService.getAllAccountEmails();
      const accountStats = [];

      let totalGTMUsers = 0;
      let totalGAUsers = 0;
      let highCapacity = 0;
      let critical = 0;

      // GTM and GA limits (can be configured)
      const GTM_LIMIT = 100; // Standard GTM user limit
      const GA_LIMIT = 100; // Standard GA user limit

      for (const email of emails) {
        try {
          const authClient = AuthService.getAuthClient(email);

          let gtmUserCount = 0;
          let gaUserCount = 0;

          // Get GTM user count across all accounts
          try {
            const tagmanager = google.tagmanager("v2");
            const accounts = await tagmanager.accounts.list({
              auth: authClient,
            });

            if (accounts.data.account) {
              for (const account of accounts.data.account) {
                try {
                  const permissions = await tagmanager.accounts.permissions.list({
                    auth: authClient,
                    parent: `accounts/${account.accountId}`,
                  });

                  if (permissions.data.accountAccess) {
                    gtmUserCount += permissions.data.accountAccess.length;
                  }
                } catch (err) {
                  console.log(`Error getting GTM permissions for ${account.accountId}:`, err.message);
                }
              }
            }
          } catch (err) {
            console.log(`Error listing GTM accounts for ${email}:`, err.message);
          }

          // Get GA user count across all accounts
          try {
            const analytics = google.analytics("v3");
            const accounts = await analytics.management.accounts.list({
              auth: authClient,
            });

            if (accounts.data.items) {
              for (const account of accounts.data.items) {
                try {
                  const users = await analytics.management.accountUserLinks.list({
                    auth: authClient,
                    accountId: account.id,
                  });

                  if (users.data.items) {
                    gaUserCount += users.data.items.length;
                  }
                } catch (err) {
                  console.log(`Error getting GA users for ${account.id}:`, err.message);
                }
              }
            }
          } catch (err) {
            console.log(`Error listing GA accounts for ${email}:`, err.message);
          }

          // Calculate capacity status
          const gtmPercentage = (gtmUserCount / GTM_LIMIT) * 100;
          const gaPercentage = (gaUserCount / GA_LIMIT) * 100;

          if (gtmPercentage >= 90 || gaPercentage >= 90) critical++;
          else if (gtmPercentage >= 75 || gaPercentage >= 75) highCapacity++;

          totalGTMUsers += gtmUserCount;
          totalGAUsers += gaUserCount;

          accountStats.push({
            email,
            gtm: {
              count: gtmUserCount,
              limit: GTM_LIMIT,
              percentage: gtmPercentage.toFixed(1),
            },
            ga: {
              count: gaUserCount,
              limit: GA_LIMIT,
              percentage: gaPercentage.toFixed(1),
            },
            lastChecked: new Date().toISOString(),
          });

          console.log(`Stats for ${email}: GTM=${gtmUserCount}, GA=${gaUserCount}`);
        } catch (error) {
          console.error(`Error getting stats for ${email}:`, error.message);
          // Add placeholder data for errored accounts
          accountStats.push({
            email,
            gtm: { count: 0, limit: GTM_LIMIT, percentage: 0, error: true },
            ga: { count: 0, limit: GA_LIMIT, percentage: 0, error: true },
            lastChecked: new Date().toISOString(),
          });
        }
      }

      res.json({
        success: true,
        data: {
          accounts: accountStats,
          summary: {
            totalGTMUsers,
            totalGAUsers,
            highCapacity,
            critical,
            totalAccounts: emails.length,
          },
          lastUpdated: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error fetching account stats:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  static async checkAccountCapacity(authClient, agencyEmail, gtmAccountId, gaAccountId) {
    const warnings = [];
    const GTM_WARNING_THRESHOLD = 85; // Warn at 85%
    const GA_WARNING_THRESHOLD = 85;
    const GTM_LIMIT = 100;
    const GA_LIMIT = 100;

    try {
      // Check GTM capacity
      if (gtmAccountId) {
        const gtmUsers = await GTMService.findAllUsers(authClient, gtmAccountId);
        const gtmCount = gtmUsers.length;
        const gtmPercentage = (gtmCount / GTM_LIMIT) * 100;

        if (gtmPercentage >= GTM_WARNING_THRESHOLD) {
          warnings.push(
            `⚠️ GTM Account ${gtmAccountId} is at ${gtmPercentage.toFixed(
              0
            )}% capacity (${gtmCount}/${GTM_LIMIT} users). ` + `Account ${agencyEmail} may be reaching its limit.`
          );
        }
      }

      // Check GA capacity
      if (gaAccountId) {
        const gaUsers = await GAService.findAllUsers(authClient, gaAccountId);
        const gaCount = gaUsers.length;
        const gaPercentage = (gaCount / GA_LIMIT) * 100;

        if (gaPercentage >= GA_WARNING_THRESHOLD) {
          warnings.push(
            `⚠️ GA Account ${gaAccountId} is at ${gaPercentage.toFixed(0)}% capacity (${gaCount}/${GA_LIMIT} users). ` +
              `Account ${agencyEmail} may be reaching its limit.`
          );
        }
      }
    } catch (error) {
      console.error("Error checking capacity:", error.message);
    }

    return warnings;
  }
}

module.exports = UserController;
