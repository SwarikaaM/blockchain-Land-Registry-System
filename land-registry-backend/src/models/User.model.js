const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match: /^0x[a-fA-F0-9]{40}$/
  },
  role: {
    type: String,
    enum: ['seller', 'buyer', 'officer', 'admin'],
    required: true
  },
  profile: {
    fullName: { type: String, trim: true },
    aadhaarHash: String,          // SHA-256 of Aadhaar — optional KYC
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    kycVerified: { type: Boolean, default: false }
  },
  nonce: String,                   // SIWE challenge nonce

  // Officer-specific fields
  officerMeta: {
    tehsil: String,
    whitelistedBy: String,         // admin wallet that whitelisted
    whitelistedAt: Date
  },

  isActive: { type: Boolean, default: true },
  lastLoginAt: Date
}, {
  timestamps: true
});

// Index for fast wallet lookup
userSchema.index({ walletAddress: 1 });
userSchema.index({ role: 1, isActive: 1 });

module.exports = mongoose.model('User', userSchema);
