const mongoose = require('mongoose');
const { Schema } = mongoose;

const consentRecordSchema = new Schema({
  coOwner: { type: Schema.Types.ObjectId, ref: 'CoOwner', required: true },
  transferRequest: { type: Schema.Types.ObjectId, ref: 'TransferRequest', required: true },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  signatureHash: String,       // wallet signature
  ipfsCID: String,             // signed consent document on IPFS
  signedAt: Date
}, {
  timestamps: true
});

consentRecordSchema.index({ transferRequest: 1 });
consentRecordSchema.index({ coOwner: 1 });

module.exports = mongoose.model('ConsentRecord', consentRecordSchema);
