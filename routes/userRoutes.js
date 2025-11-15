const express = require("express");
const UserController = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * /api/find:
 *   post:
 *     summary: Find which agency account has access to GTM/GA accounts
 *     tags: [Discovery]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *                 description: Client name to search for (searches in account names)
 *                 example: "Acme Corporation"
 *               gaAccountId:
 *                 type: string
 *                 description: Google Analytics Account ID
 *                 example: "123456789"
 *               gtmAccountId:
 *                 type: string
 *                 description: Google Tag Manager Account ID
 *                 example: "987654321"
 *     responses:
 *       200:
 *         description: Successfully found account with access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 agencyAccount:
 *                   type: string
 *                   description: Email of agency account with access
 *                 matchedBy:
 *                   type: string
 *                   description: How the account was matched (Account ID or Client Name)
 *                 users:
 *                   type: object
 *                   properties:
 *                     gtm:
 *                       type: array
 *                       items:
 *                         type: object
 *                     ga:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: No account found
 *       500:
 *         description: Server error
 */
router.post("/find", UserController.findAccount);

/**
 * @swagger
 * /api/migrate:
 *   post:
 *     summary: Process user migration or offboarding
 *     tags: [Migrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientName
 *               - moveType
 *               - newEmail
 *             properties:
 *               clientName:
 *                 type: string
 *                 description: Name of the client
 *                 example: "Acme Corporation"
 *               moveType:
 *                 type: string
 *                 enum: [migration, offboard]
 *                 description: Type of operation - migration for existing clients, offboard for dead clients
 *                 example: "migration"
 *               newEmail:
 *                 type: string
 *                 format: email
 *                 description: Email address of new user to add
 *                 example: "newuser@example.com"
 *               offboardEmail:
 *                 type: string
 *                 format: email
 *                 description: Offboard account email (required for offboard type)
 *                 example: "offboard@agency.com"
 *               gaAccountId:
 *                 type: string
 *                 description: Google Analytics Account ID
 *                 example: "123456789"
 *               gtmAccountId:
 *                 type: string
 *                 description: Google Tag Manager Account ID
 *                 example: "987654321"
 *               gtmContainerId:
 *                 type: string
 *                 description: Google Tag Manager Container ID
 *                 example: "111222333"
 *     responses:
 *       200:
 *         description: Migration completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 results:
 *                   type: object
 *                   properties:
 *                     moveId:
 *                       type: integer
 *                     agencyAccount:
 *                       type: string
 *                     gtm:
 *                       type: object
 *                     ga:
 *                       type: object
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/migrate", UserController.processUserMigration);

/**
 * @swagger
 * /api/migrations:
 *   get:
 *     summary: Get migration history
 *     tags: [History]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Maximum number of records to return
 *       - in: query
 *         name: clientName
 *         schema:
 *           type: string
 *         description: Filter by client name
 *     responses:
 *       200:
 *         description: List of migrations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       move_id:
 *                         type: integer
 *                       client_name:
 *                         type: string
 *                       move_type:
 *                         type: string
 *                       old_email:
 *                         type: string
 *                       new_email:
 *                         type: string
 *                       status:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Server error
 */
router.get("/migrations", UserController.getMigrationHistory);

/**
 * @swagger
 * /api/migrations/{id}:
 *   get:
 *     summary: Get specific migration by ID
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Migration ID
 *     responses:
 *       200:
 *         description: Migration details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Migration not found
 *       500:
 *         description: Server error
 */
router.get("/migrations/:id", UserController.getMigrationById);

/**
 * @swagger
 * /api/accounts/stats:
 *   get:
 *     summary: Get account capacity statistics for all agency accounts
 *     tags: [Monitoring]
 *     description: |
 *       Returns real-time capacity information for all 13 agency accounts.
 *       Shows user counts for both GTM and GA, capacity percentages, and alerts.
 *
 *       **Capacity Thresholds:**
 *       - Good: 0-49% capacity (green)
 *       - Medium: 50-74% capacity (yellow)
 *       - High: 75-89% capacity (orange)
 *       - Critical: 90-100% capacity (red)
 *
 *       **Use Cases:**
 *       - Monitor account capacity in real-time
 *       - Identify accounts nearing limits
 *       - Plan capacity management
 *       - Prevent migration failures due to full accounts
 *     responses:
 *       200:
 *         description: Account statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accounts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                             example: "account1@agency.com"
 *                           gtm:
 *                             type: object
 *                             properties:
 *                               count:
 *                                 type: integer
 *                                 example: 45
 *                               limit:
 *                                 type: integer
 *                                 example: 100
 *                               percentage:
 *                                 type: string
 *                                 example: "45.0"
 *                           ga:
 *                             type: object
 *                             properties:
 *                               count:
 *                                 type: integer
 *                                 example: 67
 *                               limit:
 *                                 type: integer
 *                                 example: 100
 *                               percentage:
 *                                 type: string
 *                                 example: "67.0"
 *                           lastChecked:
 *                             type: string
 *                             format: date-time
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalGTMUsers:
 *                           type: integer
 *                           example: 523
 *                         totalGAUsers:
 *                           type: integer
 *                           example: 734
 *                         highCapacity:
 *                           type: integer
 *                           example: 2
 *                           description: Number of accounts at 75-89% capacity
 *                         critical:
 *                           type: integer
 *                           example: 1
 *                           description: Number of accounts at 90%+ capacity
 *                         totalAccounts:
 *                           type: integer
 *                           example: 13
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Server error
 */
router.get("/accounts/stats", UserController.getAccountStats);

module.exports = router;
