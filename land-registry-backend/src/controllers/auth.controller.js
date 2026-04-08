const asyncHandler = require('../utils/asyncHandler');
const nonceService = require('../services/auth/nonce.service');
const signatureService = require('../services/auth/signature.service');
const { buildSiweMessage } = require('../utils/walletUtils');
const { authenticate } = require('../middleware/auth.middleware');
const User = require('../models/User.model');
const logger = require('../utils/logger');

/**
 * POST /auth/nonce
 * Generate a nonce for wallet-based SIWE authentication.
 */
exports.getNonce = asyncHandler(async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ success: false, error: 'walletAddress required' });
  }

  const nonce = await nonceService.generate(walletAddress);

  // Build the SIWE message for the frontend to display
  const message = buildSiweMessage({
    address: walletAddress,
    nonce,
    chainId: parseInt(process.env.CHAIN_ID) || 137,
    domain: process.env.FRONTEND_DOMAIN || 'localhost',
    uri: process.env.FRONTEND_URI || 'http://localhost:3000'
  });

  res.json({
    success: true,
    nonce,
    message
  });
});

/**
 * POST /auth/verify
 * Verify a signed SIWE message and issue JWT.
 * Auto-creates profile if user is new.
 */
exports.verifySignature = asyncHandler(async (req, res) => {
  const { message, signature, role } = req.body;

  if (!message || !signature) {
    return res.status(400).json({
      success: false,
      error: 'message and signature required'
    });
  }

  // Validate role if provided
  const validRoles = ['seller', 'buyer'];
  const userRole = validRoles.includes(role) ? role : 'buyer';

  const result = await signatureService.verifyAndAuthenticate({
    message,
    signature,
    role: userRole
  });

  logger.info('User authenticated', {
    walletAddress: result.user.walletAddress,
    isNew: result.isNew
  });

  res.json({
    success: true,
    ...result
  });
});

/**
 * GET /auth/me
 * Get current authenticated user from JWT.
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-nonce');

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  res.json({
    success: true,
    user
  });
});
