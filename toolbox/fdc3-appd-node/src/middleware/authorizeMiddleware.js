// Authorization middleware
const authorize = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req.user) {
			return res.status(401).json({ message: "Not authorized" });
		}
		if (req.user.status === "inactive")
			return res.status(403).json({ message: "User is inactive" });

		// Check if the user's role is in the list of allowed roles
		if (!allowedRoles.includes(req.user.role)) {
			return res
				.status(403)
				.json({ message: "Forbidden - You do not have permission" });
		}

		next();
	};
};

module.exports = { authorize };
