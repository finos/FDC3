const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			lowercase: true,
			validate: {
				validator: (value) => validator.isEmail(value),
				message: "Invalid email format",
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: [7, "Password must be at least 7 characters long"],
			validate: {
				validator: function (value) {
					return !value.toLowerCase().includes("password");
				},
				message: "Password should not contain the word 'password'",
			},
		},
		age: {
			type: Number,
			default: 0,
			validate: {
				validator: function (value) {
					return value >= 0;
				},
				message: "Age must be a positive number",
			},
		},
		role: {
			type: String,
			enum: ["user", "admin", "editor", "desktopAgent"], // Define allowed roles
			default: "user", // Default role is "user"
		},
		status: {
			type: String,
			enum: ["active", "inactive"], // Define allowed roles
			default: "inactive", // Default role is "inactive"
		},
	},
	{
		timestamps: true, // Adds createdAt and updatedAt fields
		versionKey: false, // Removes __v field
	}
);

// Index for faster queries
UserSchema.index({ email: 1 });

// Hash the password before saving the user document
UserSchema.pre("save", async function (next) {
	const user = this;

	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 10); // Hash password with bcrypt
	}

	next();
});

// Hide sensitive data when converting to JSON
UserSchema.methods.toJSON = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

module.exports = mongoose.model("User", UserSchema);
