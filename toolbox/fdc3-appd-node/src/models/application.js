const mongoose = require("mongoose");
const validator = require("validator");
const IntentSchema = require("./intent");

const ApplicationSchema = new mongoose.Schema(
	{
		appId: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			validate: {
				validator: function (v) {
					return /^[a-zA-Z0-9-_]+$/.test(v);
				},
				message:
					"appId can only contain letters, numbers, hyphens and underscores",
			},
		},
		title: {
			type: String,
			required: true,
			trim: true,
			minlength: [2, "Title must be at least 2 characters long"],
			maxlength: [100, "Title cannot exceed 100 characters"],
		},
		description: {
			type: String,
			trim: true,
			maxlength: [1000, "Description cannot exceed 1000 characters"],
		},
		version: {
			type: String,
			validate: {
				validator: function (v) {
					return /^\d+\.\d+\.\d+$/.test(v);
				},
				message: "Version must be in semver format (e.g., 1.0.0)",
			},
		},
		categories: [
			{
				type: String,
				trim: true,
				uppercase: true,
			},
		],
		icons: [
			{
				src: {
					type: String,
					required: true,
					validate: {
						validator: (v) => validator.isURL(v),
						message: "Icon URL must be valid",
					},
				},
				size: {
					type: String,
					validate: {
						validator: function (v) {
							return /^\d+x\d+$/.test(v);
						},
						message: "Size must be in format WxH (e.g., 32x32)",
					},
				},
			},
		],
		screenshots: [
			{
				src: {
					type: String,
					required: true,
					validate: {
						validator: (v) => validator.isURL(v),
						message: "Screenshot URL must be valid",
					},
				},
				label: {
					type: String,
					trim: true,
					maxlength: [100, "Label cannot exceed 100 characters"],
				},
			},
		],
		contactEmail: {
			type: String,
			trim: true,
			lowercase: true,
			validate: {
				validator: (v) => validator.isEmail(v),
				message: "Invalid contact email",
			},
		},
		supportEmail: {
			type: String,
			trim: true,
			lowercase: true,
			validate: {
				validator: (v) => validator.isEmail(v),
				message: "Invalid support email",
			},
		},
		moreInfo: {
			type: String,
			validate: {
				validator: (v) => validator.isURL(v),
				message: "More info URL must be valid",
			},
		},
		publisher: {
			type: String,
			trim: true,
			maxlength: [100, "Publisher name cannot exceed 100 characters"],
		},
		details: {
			url: {
				type: String,
				validate: {
					validator: (v) => validator.isURL(v),
					message: "Application URL must be valid",
				},
			},
		},
		intents: [IntentSchema],
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "inactive",
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

// Indexes for faster queries
ApplicationSchema.index({ appId: 1 });
ApplicationSchema.index({ categories: 1 });
ApplicationSchema.index({ title: "text", description: "text" }); // Text search index

module.exports = mongoose.model("Application", ApplicationSchema);
