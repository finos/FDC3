/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 7
 *           description: User's password (must not contain the word 'password')
 *           example: "strongP@ssw0rd123"
 *         age:
 *           type: number
 *           default: 0
 *           description: User's age
 *           example: 30
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of user creation
 *           example: "2024-03-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of last update
 *           example: "2024-03-15T10:30:00Z"
 *         role:
 *           type: string
 *           enum: ["user", "admin", "editor", "desktopAgent"]
 *           default: "user"
 *           description: User's role in the system
 *           example: "user"
 *         status:
 *           type: string
 *           enum: ["active", "inactive"]
 *           default: "inactive"
 *           description: User's account status
 *           example: "inactive"
 */
