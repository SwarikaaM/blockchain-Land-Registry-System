const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'land-registry-dev-secret-change-in-production';

/**
 * JWT authentication middleware.
 * Extracts token from Authorization header, verifies it,
 * and attaches the user document to req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Provide Bearer token.'
      });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, error: 'Token expired' });
      }
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const user = await User.findById(decoded.userId).lean();

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User not found or deactivated'
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    logger.error('Auth middleware error', { error: err.message });
    return res.status(500).json({ success: false, error: 'Authentication error' });
  }
};

/**
 * Generate a JWT token for a user.
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      walletAddress: user.walletAddress,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Optional auth — attaches user if token present, but doesn't block.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).lean();
      if (user && user.isActive) {
        req.user = user;
        req.userId = user._id;
      }
    }
  } catch (_) {
    // Silently continue without auth
  }
  next();
};

module.exports = { authenticate, generateToken, optionalAuth };
