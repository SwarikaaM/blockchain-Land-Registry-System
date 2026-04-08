const mongoose = require('mongoose');
const { Schema } = mongoose;

const transferRequestSchema = new Schema({
  land: { type: Schema.Types.ObjectId, ref: 'Land', required: true },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  price: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'POL' }
  },

  // Transfer lifecycle state machine
  status: {
    type: String,
    enum: [
      'offer_sent',
      'offer_accepted',
      'coowner_consent_pending',
      'officer_review',
      'escrow_locked',
      'approved',
      'completed',
      'rejected',
      'cancelled'
    ],
    default: 'offer_sent'
  },

  // Per-co-owner consent tracking
  coOwnerConsents: [{
    coOwner: { type: Schema.Types.ObjectId, ref: 'CoOwner' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    signedAt: Date
  }],

  // Officer case reference (if flagged)
  officerCase: { type: Schema.Types.ObjectId, ref: 'OfficerCase' },

  // Escrow details
  escrow: {
    contractAddress: String,
    txHash: String,
    lockedAmount: Number,
    status: {
      type: String,
      enum: ['none', 'intent_deposit', 'locked', 'released', 'refunded'],
      default: 'none'
    }
  },

  // On-chain completion
  transferTxHash: String
}, {
  timestamps: true
});

transferRequestSchema.index({ land: 1, status: 1 });
transferRequestSchema.index({ seller: 1 });
transferRequestSchema.index({ buyer: 1 });
transferRequestSchema.index({ status: 1 });

module.exports = mongoose.model('TransferRequest', transferRequestSchema);
