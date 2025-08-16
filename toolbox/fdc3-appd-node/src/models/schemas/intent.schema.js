/**
 * @swagger
 * components:
 *   schemas:
 *     Intent:
 *       type: object
 *       description: An intent definition
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the intent (must start with a letter and can contain only letters, numbers, and dots)
 *           pattern: "^[a-zA-Z][a-zA-Z0-9\\.]*$"
 *           example: "ViewChart"
 *         displayName:
 *           type: string
 *           description: An optional display name for the intent
 *           maxLength: 100
 *           example: "View Trading Chart"
 *         contexts:
 *           type: array
 *           items:
 *             type: string
 *             pattern: "^[a-zA-Z]+(\\.[a-zA-Z0-9]+)*$"
 *           description: The contexts the intent accepts (in namespaced format, e.g., org.fdc3.instrument)
 *           example: ["org.fdc3.instrument"]
 *         customConfig:
 *           type: object
 *           nullable: true
 *           description: Custom configuration for the intent (must be null or a valid object)
 *           example: { "agent": "symphony", "version": "2.0" }
 */
