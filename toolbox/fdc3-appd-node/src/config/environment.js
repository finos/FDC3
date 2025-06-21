require("dotenv").config();

const environment = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8080,
  HOST: process.env.HOST || "localhost",
  DB_TYPE: process.env.DB_TYPE || "mongo",
  MONGODB_URL: process.env.MONGODB_URL,
  POSTGRES_URI: process.env.POSTGRES_URI,
  ORACLE_URI: process.env.ORACLE_URI,

  // Helper methods
  isDevelopment: function () {
    return this.NODE_ENV === "development";
  },

  isProduction: function () {
    return this.NODE_ENV === "production";
  },

  getDatabaseUri: function () {
    switch (this.DB_TYPE) {
      case "mongo":
        return this.MONGODB_URL;
      case "postgres":
        return this.POSTGRES_URI;
      case "oracle":
        return this.ORACLE_URI;
      default:
        throw new Error(`Unsupported database type: ${this.DB_TYPE}`);
    }
  },

  // Get base URL for the API
  getBaseUrl: function () {
    const protocol = this.isDevelopment() ? "http" : "https";
    return `${protocol}://${this.HOST}:${this.PORT}`;
  },
};

// Validate required environment variables
const requiredEnvVars = ["DB_TYPE"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

module.exports = environment;
