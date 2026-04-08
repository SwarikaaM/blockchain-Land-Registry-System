const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User.model');
const { sha256 } = require('../utils/hashData');
const logger = require('../utils/logger');

/**
 * GET /profile
 * Get current user's profile.
 */
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select('-nonce');

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  res.json({ success: true, profile: user });
});

/**
 * PUT /profile
 * Update profile fields (name, phone, email).
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, email } = req.body;

  const update = {};
  if (fullName !== undefined) update['profile.fullName'] = fullName;
  if (phone !== undefined) update['profile.phone'] = phone;
  if (email !== undefined) update['profile.email'] = email;

  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: update },
    { new: true, runValidators: true }
  ).select('-nonce');

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  logger.info('Profile updated', { userId: req.userId });

  res.json({ success: true, profile: user });
});

/**
 * POST /profile/kyc
 * Submit Aadhaar hash for optional KYC verification.
 * Stores only the SHA-256 hash, never the raw Aadhaar number.
 */
exports.submitKyc = asyncHandler(async (req, res) => {
  const { aadhaarNumber } = req.body;

  if (!aadhaarNumber || aadhaarNumber.length !== 12) {
    return res.status(400).json({
      success: false,
      error: 'Valid 12-digit Aadhaar number required'
    });
  }

  const aadhaarHash = sha256(aadhaarNumber);

  const user = await User.findByIdAndUpdate(
    req.userId,
    {
      $set: {
        'profile.aadhaarHash': aadhaarHash,
        'profile.kycVerified': true
      }
    },
    { new: true }
  ).select('-nonce');

  logger.info('KYC submitted', { userId: req.userId });

  res.json({
    success: true,
    profile: user,
    message: 'Aadhaar hash stored. KYC marked as verified.'
  });
});
