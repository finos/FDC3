const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const env = require("./environment");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "FDC3 Application Directory",
    version: "1.0.0",
    description: "Application Directory specification for FDC3",
    contact: {
      email: "support@fdc3.org",
    },
  },
  servers: [
    {
      url: env.getBaseUrl(),
      description: `${env.NODE_ENV.toUpperCase()} server`,
    },
  ],
  tags: [
    {
      name: "Applications",
      description: "Application Directory API endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints",
    },
    {
      name: "Health",
      description: "Service health and monitoring endpoints",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token in the format: Bearer <token>",
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js", "./src/models/*.js", "./src/models/schemas/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
