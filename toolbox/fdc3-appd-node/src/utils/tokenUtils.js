// In-memory blacklist for revoked tokens
const revokedTokens = new Set();

/**
 * Function to check if a token has been revoked
 * @param {string} token - The JWT token to check
 * @returns {boolean} - Returns true if the token is revoked, false otherwise
 */
const checkIfTokenRevoked = async (token) => {
	return revokedTokens.has(token);
};

/**
 * Function to revoke a token (e.g., during logout)
 * @param {string} token - The JWT token to revoke
 */
const revokeToken = (token) => {
	revokedTokens.add(token);
};

module.exports = { checkIfTokenRevoked, revokeToken };
