const mongoose = require("mongoose");

const IntentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Ensure name follows a reasonable pattern for intent names
          return /^[a-zA-Z][a-zA-Z0-9.]*$/.test(v);
        },
        message:
          "Intent name must start with a letter and can contain only letters, numbers, and dots",
      },
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [100, "Display name cannot exceed 100 characters"],
    },
    contexts: [
      {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            // Validate context format (e.g., "org.fdc3.instrument")
            return /^[a-zA-Z]+(\.[a-zA-Z0-9]+)*$/.test(v);
          },
          message:
            "Context must be in namespaced format (e.g., org.fdc3.instrument)",
        },
      },
    ],
    customConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      validate: {
        validator: function (v) {
          // Ensure customConfig is a valid object
          return v === null || typeof v === "object";
        },
        message: "customConfig must be a valid object",
      },
    },
  },
  { _id: false }
);

module.exports = IntentSchema;
