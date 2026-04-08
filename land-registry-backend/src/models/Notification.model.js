const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  type: {
    type: String,
    enum: [
      'verification_complete',
      'transfer_offer',
      'noc_request',
      'officer_assigned',
      'escrow_locked',
      'transfer_complete',
      'warning',
      'system'
    ],
    required: true
  },

  title: { type: String, required: true },
  message: { type: String, required: true },
  metadata: Schema.Types.Mixed,     // landId, transferId, caseId, etc.

  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
