const { verifySiweSignature } = require('../../utils/walletUtils');
const { generateToken } = require('../../middleware/auth.middleware');
const User = require('../../models/User.model');
const logger = require('../../utils/logger');

class SignatureService {
  /**
   * Verify a SIWE signature and return or create the user + JWT.
   *
   * @param {string} message - The SIWE message the user signed
   * @param {string} signature - The signature from MetaMask
   * @param {string} role - Role to assign if new user (seller/buyer)
   * @returns {{ user, token, isNew }}
   */
  async verifyAndAuthenticate({ message, signature, role = 'buyer' }) {
    // Verify the signature and recover wallet address
    const walletAddress = await verifySiweSignature({ message, signature });
    logger.info('SIWE signature verified', { walletAddress });

    // Find or create user
    let user = await User.findOne({ walletAddress });
    let isNew = false;

    if (!user) {
      // Auto-create profile from wallet
      user = await User.create({
        walletAddress,
        role,
        profile: {},
        isActive: true
      });
      isNew = true;
      logger.info('New user created', { walletAddress, role });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate JWT
    const token = generateToken(user);

    return {
      user: {
        _id: user._id,
        walletAddress: user.walletAddress,
        role: user.role,
        profile: user.profile,
        isActive: user.isActive
      },
      token,
      isNew
    };
  }
}

module.exports = new SignatureService();
