const express = require("express");
const WebhookController = require("../controllers/webhookController");

const router = express.Router();

/**
 * @swagger
 * /api/webhook/monday:
 *   post:
 *     summary: Monday.com webhook endpoint for automated migrations
 *     tags: [Webhooks]
 *     description: |
 *       Receives webhooks from Monday.com boards and automatically processes user migrations or offboards.
 *
 *       **Board Setup:**
 *       - Configure a webhook in your Monday.com board automation
 *       - Set webhook URL to: `https://your-domain.com/api/webhook/monday`
 *       - Trigger on status change or manual action
 *
 *       **Required Board Columns (flexible column IDs):**
 *       - Client Name: `client_name`, `client`, `name`, or item name
 *       - Operation Type: `operation_type`, `operation`, `type` (values: "migration" or "offboard")
 *       - Status: `status` (values: "Pending", "Processing", "Completed", "Failed")
 *
 *       **Operation-Specific Columns:**
 *       - For Migration: `new_user_email`, `new_email`, `email`
 *       - For Offboard: `offboard_email`, `offboard`
 *
 *       **Account IDs (at least one required):**
 *       - GA: `ga_account_id`, `ga_id`, `google_analytics_id`
 *       - GTM: `gtm_account_id`, `gtm_id`, `tag_manager_id`
 *       - GTM Container: `gtm_container_id`, `container_id`
 *
 *       **Optional Output Columns:**
 *       - Migration ID: `migration_id`, `move_id`
 *       - Agency Account: `agency_account`, `account`
 *       - Error Message: `error_message`, `error`
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: object
 *                 properties:
 *                   boardId:
 *                     type: integer
 *                     description: Monday.com board ID
 *                   pulseId:
 *                     type: integer
 *                     description: Monday.com item/pulse ID
 *                   columnId:
 *                     type: string
 *                     description: Column that triggered the webhook
 *                   value:
 *                     type: object
 *                     description: New value of the column
 *               boardId:
 *                 type: integer
 *                 description: Alternate format - board ID
 *               itemId:
 *                 type: integer
 *                 description: Alternate format - item ID
 *           examples:
 *             standardFormat:
 *               summary: Standard Monday webhook format
 *               value:
 *                 event:
 *                   boardId: 123456789
 *                   pulseId: 987654321
 *                   columnId: "status"
 *                   value:
 *                     label: "Pending"
 *             directFormat:
 *               summary: Direct payload format
 *               value:
 *                 boardId: 123456789
 *                 itemId: 987654321
 *     responses:
 *       200:
 *         description: Migration processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 moveId:
 *                   type: integer
 *                   example: 42
 *                 agencyAccount:
 *                   type: string
 *                   example: "account1@agency.com"
 *                 message:
 *                   type: string
 *                   example: "Migration completed and Monday board updated"
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                 receivedPayload:
 *                   type: object
 *       401:
 *         description: Invalid webhook signature
 *       500:
 *         description: Server error during migration
 *     security:
 *       - webhookSignature: []
 */
router.post("/monday", WebhookController.handleMondayWebhook);

module.exports = router;
