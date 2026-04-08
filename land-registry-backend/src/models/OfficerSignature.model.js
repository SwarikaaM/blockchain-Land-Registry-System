const mongoose = require('mongoose');
const { Schema } = mongoose;

const officerSignatureSchema = new Schema({
  officerCase: { type: Schema.Types.ObjectId, ref: 'OfficerCase', required: true },
  officer: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  decision: {
    type: String,
    enum: ['approve', 'reject'],
    required: true
  },

  justification: { type: String, default: '' },
  signatureHash: String,       // wallet signature hash
  txHash: String,              // on-chain transaction hash

  signedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

officerSignatureSchema.index({ officerCase: 1 });
officerSignatureSchema.index({ officer: 1 });

module.exports = mongoose.model('OfficerSignature', officerSignatureSchema);
