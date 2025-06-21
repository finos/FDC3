/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       required:
 *         - appId
 *         - title
 *       properties:
 *         appId:
 *           type: string
 *           description: Unique identifier for the application (letters, numbers, hyphens and underscores only)
 *           pattern: "^[a-zA-Z0-9-_]+$"
 *           example: "app-123"
 *         title:
 *           type: string
 *           description: Application title (2-100 characters)
 *           minLength: 2
 *           maxLength: 100
 *           example: "Trading App"
 *         description:
 *           type: string
 *           description: Detailed description of the application
 *           maxLength: 1000
 *           example: "A powerful trading application"
 *         version:
 *           type: string
 *           description: Application version
 *           pattern: "^\\d+\\.\\d+\\.\\d+$"
 *           example: "1.0.0"
 *         intents:
 *           type: array
 *           items:
 *             $ref: './intent.schema.js'
 *           description: List of intents supported by the application
 *           example:
 *             - name: "ViewChart"
 *               displayName: "View Trading Chart"
 *               contexts: ["org.fdc3.instrument"]
 *               customConfig:
 *                 agent: "symphony"
 *                 version: "2.0"
 *             - name: "ViewContact"
 *               displayName: "View Contact Details"
 *               contexts: ["org.symphony.contact"]
 *         categories:
 *           type: array
 *           items:
 *             type: string
 *             description: Categories are stored in uppercase
 *           example: ["TRADING", "FINANCE"]
 *         icons:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - src
 *             properties:
 *               src:
 *                 type: string
 *                 format: uri
 *                 description: URL to the icon
 *                 example: "https://example.com/icon.png"
 *               size:
 *                 type: string
 *                 pattern: "^\\d+x\\d+$"
 *                 description: Icon size (e.g., '16x16', '32x32')
 *                 example: "32x32"
 *         screenshots:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - src
 *             properties:
 *               src:
 *                 type: string
 *                 format: uri
 *                 description: URL to the screenshot
 *                 example: "https://example.com/screenshot.png"
 *               label:
 *                 type: string
 *                 description: Screenshot description
 *                 example: "Main trading view"
 *         contactEmail:
 *           type: string
 *           format: email
 *           description: Contact email for the application
 *           example: "contact@tradingapp.com"
 *         supportEmail:
 *           type: string
 *           format: email
 *           description: Support email for the application
 *           example: "support@tradingapp.com"
 *         moreInfo:
 *           type: string
 *           format: uri
 *           description: Additional information URL
 *           example: "https://tradingapp.com/info"
 *         publisher:
 *           type: string
 *           description: Application publisher name
 *           example: "Trading Solutions Inc."
 *         details:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               format: uri
 *               description: Application URL
 *               example: "https://tradingapp.com"
 *         status:
 *           type: string
 *           enum: ["active", "inactive"]
 *           default: "inactive"
 *           description: Application status
 *           example: "inactive"
 */
