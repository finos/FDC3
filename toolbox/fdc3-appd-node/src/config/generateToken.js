const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Load private key for signing (RS256)
const privateKey = fs.readFileSync(
	path.resolve(__dirname, "../keys/private.key"),
	"utf8"
);

// Generate JWT Token
const generateToken = (id) => {
	try {
		// Create token payload
		const payload = {
			id,
			iat: Math.floor(Date.now() / 1000), // Issued at time
			aud: "your-app-users", // Audience claim
		};

		// Sign the token with RS256 algorithm
		return jwt.sign(payload, privateKey, {
			algorithm: "RS256", // Use RS256 for asymmetric signing
			expiresIn: process.env.JWT_EXPIRATION || "15m", // Expiration time from env or default 15 minutes
			issuer: "your-app", // Issuer claim
		});
	} catch (error) {
		console.error("Error generating token:", error);
		throw new Error("Token generation failed");
	}
};

module.exports = generateToken;
