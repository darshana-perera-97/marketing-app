const crypto = require('crypto');

/**
 * Simple password hashing (for demo purposes)
 * In production, use bcrypt or argon2
 */
function hashPassword(password) {
  // Simple hash for demo - in production use bcrypt
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Verify password
 */
function verifyPassword(password, hashedPassword) {
  return hashPassword(password) === hashedPassword;
}

/**
 * Generate a simple token (for demo purposes)
 * In production, use JWT
 */
function generateToken(userId) {
  return `token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Verify token and extract user ID
 * In production, use JWT verification
 * Supports both numeric IDs (legacy) and UUID string IDs
 */
function verifyToken(token) {
  if (!token) {
    return null;
  }
  
  // Extract user ID from token format: token_USERID_TIMESTAMP_RANDOM
  const parts = token.split('_');
  if (parts.length < 2 || parts[0] !== 'token') {
    return null;
  }
  
  // Try to parse as number first (for backward compatibility)
  const userIdStr = parts[1];
  const userIdNum = parseInt(userIdStr);
  
  // If it's a valid number, return it (legacy support)
  // Otherwise, treat it as a UUID string
  if (!isNaN(userIdNum) && userIdNum.toString() === userIdStr) {
    return userIdNum;
  }
  
  // Return as string (UUID format)
  return userIdStr;
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken
};

