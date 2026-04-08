const mongoose = require('mongoose');
const { Schema } = mongoose;

const landSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  coOwners: [{ type: Schema.Types.ObjectId, ref: 'CoOwner' }],

  location: {
    district: { type: String, trim: true },
    districtValue: String,
    taluka: { type: String, trim: true },
    talukaValue: String,
    village: { type: String, trim: true },
    villageValue: String,
    surveyNumber: { type: String, trim: true },
    gatNumber: { type: String, trim: true }
  },

  area: {
    value: { type: Number, required: true },
    unit: {
      type: String,
      enum: ['sqm', 'hectare', 'acre', 'guntha'],
      default: 'sqm'
    }
  },

  encumbrances: { type: String, default: '' },
  boundaryDescription: { type: String, default: '' },

  // Workflow state machine
  status: {
    type: String,
    enum: [
      'draft',
      'documents_uploaded',
      'verification_pending',
      'verification_passed',
      'verification_failed',
      'officer_review',
      'registered',
      'listed',
      'transfer_pending',
      'transferred'
    ],
    default: 'draft'
  },

  // IPFS document CIDs
  documents: {
    sevenTwelveCID: String,           // 7/12 extract image/PDF
    mahabhulekhSnapshotCID: String,   // scraped HTML snapshot
    mahabhunakshaSnapshotCID: String, // map snapshot
    nocDocuments: [{
      coOwnerId: { type: Schema.Types.ObjectId },
      cid: String
    }],
    polygonGeoJsonCID: String
  },

  // Verification reference
  verificationResult: { type: Schema.Types.ObjectId, ref: 'VerificationResult' },
  legacyFlag: { type: Boolean, default: false },

  // On-chain data
  onChainTokenId: String,
  registrationTxHash: String
}, {
  timestamps: true
});

// Indexes
landSchema.index({ owner: 1, status: 1 });
landSchema.index({ 'location.district': 1, 'location.taluka': 1, 'location.village': 1 });
landSchema.index({ 'location.surveyNumber': 1 });
landSchema.index({ status: 1 });

module.exports = mongoose.model('Land', landSchema);
