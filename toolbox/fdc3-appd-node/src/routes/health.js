const express = require("express");
const router = express.Router();
const dbOrchestrator = require("../db/DatabaseOrchestrator");

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [healthy, unhealthy]
 *           description: Current health status
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Current timestamp
 *         uptime:
 *           type: number
 *           description: Service uptime in seconds
 *         service:
 *           type: string
 *           description: Service name
 *     DetailedHealthResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/HealthResponse'
 *         - type: object
 *           properties:
 *             memory:
 *               type: object
 *               properties:
 *                 usage:
 *                   type: object
 *                   properties:
 *                     heapUsed:
 *                       type: number
 *                     heapTotal:
 *                       type: number
 *                     external:
 *                       type: number
 *                 free:
 *                   type: number
 *             database:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [connected, disconnected]
 *                 healthy:
 *                   type: boolean
 */

/**
 * @swagger
 * /v1/health:
 *   get:
 *     summary: Basic health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date(),
    uptime: process.uptime(),
    service: "user-service",
  });
});

/**
 * @swagger
 * /v1/health/detailed:
 *   get:
 *     summary: Detailed health check including memory and database status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetailedHealthResponse'
 *       503:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [unhealthy]
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 error:
 *                   type: string
 */
router.get("/health/detailed", async (req, res) => {
  try {
    const dbHealthy = await dbOrchestrator.checkHealth();

    if (!dbHealthy) {
      throw new Error("Database is not healthy");
    }

    res.status(200).json({
      status: "healthy",
      timestamp: new Date(),
      uptime: process.uptime(),
      service: "user-service",
      memory: {
        usage: process.memoryUsage(),
        free: process.memoryUsage().heapTotal - process.memoryUsage().heapUsed,
      },
      database: {
        status: "connected",
        healthy: true,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date(),
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /v1/health/live:
 *   get:
 *     summary: Kubernetes liveness probe
 *     description: Used by Kubernetes to determine if the service is alive
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [alive]
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get("/health/live", (req, res) => {
  res.status(200).json({
    status: "alive",
    timestamp: new Date(),
  });
});

/**
 * @swagger
 * /v1/health/ready:
 *   get:
 *     summary: Kubernetes readiness probe
 *     description: Used by Kubernetes to determine if the service can handle traffic
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [ready]
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: Service is not ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [not ready]
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 error:
 *                   type: string
 */
router.get("/health/ready", async (req, res) => {
  try {
    const dbHealthy = await dbOrchestrator.checkHealth();

    if (!dbHealthy) {
      throw new Error("Database is not ready");
    }

    res.status(200).json({
      status: "ready",
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(503).json({
      status: "not ready",
      timestamp: new Date(),
      error: error.message,
    });
  }
});

module.exports = router;
