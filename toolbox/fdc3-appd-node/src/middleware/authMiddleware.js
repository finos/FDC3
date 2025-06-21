const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");
const { checkIfTokenRevoked } = require( "../utils/tokenUtils.js" );

// Load public key for verifying JWT (RS256)
const publicKey = fs.readFileSync(
	path.resolve(__dirname, "../keys/public.key"),
	"utf8"
);

const protect = asyncHandler(async (req, res, next) => {
	let token;

	// Check if authorization header exists and starts with "Bearer"
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else {
		res.status(401);
		throw new Error("Not authorized, no token");
	}
  
	try {
    // Verify token using RS256 algorithm with public key
		const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
			issuer: "your-app",
			audience: "your-app-users",
		});

		// Optional: Check if token is revoked
		const isRevoked = await checkIfTokenRevoked(token);
		if (isRevoked) {
			res.status(401);
			throw new Error("Token revoked");
		}

		// Attach user to request object without password field
		req.user = await User.findById(decoded.id).select("-password");

		next();
	} catch (error) {
		res.status(401);
		throw new Error("Not authorized");
	}
});

module.exports = { protect };
