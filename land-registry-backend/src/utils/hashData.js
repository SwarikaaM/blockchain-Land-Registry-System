const crypto = require('crypto');

/**
 * SHA-256 hash of any string input.
 * Used for Aadhaar masking. document integrity checks, etc.
 */
exports.sha256 = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Hash a JSON object deterministically.
 * Sorts keys before hashing for consistency.
 */
exports.hashObject = (obj) => {
  const sorted = JSON.stringify(obj, Object.keys(obj).sort());
  return exports.sha256(sorted);
};

/**
 * Generate a random hex string of given byte length.
 */
exports.randomHex = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};
