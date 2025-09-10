const winston = require("winston");

// Not found middleware
const notFound = (req, res, next) => {
	res.status(404);
	next({
		message: `Not Found - ${req.originalUrl}`,
		statusCode: 404,
	});
};

// General error handler middleware
const errorHandler = (err, req, res, next) => {
	// Default to 500 if no status code is set
	const statusCode =
		err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode);

	// Log the error details (in production, use a logger like winston)
	if (process.env.NODE_ENV !== "production") {
		console.error(err);
	} else {
		winston.error(err.message); // Log errors in production
	}

	// Respond with JSON or HTML based on Accept header
	if (req.accepts("json")) {
		res.json({
			message: err.message || "An unexpected error occurred",
			stack: process.env.NODE_ENV === "production" ? null : err.stack,
		});
	} else {
		res.type("text").send(err.message || "An unexpected error occurred");
	}
};

module.exports = { notFound, errorHandler };
