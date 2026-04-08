const mongoose = require('mongoose');
const { Schema } = mongoose;

const verificationResultSchema = new Schema({
  land: { type: Schema.Types.ObjectId, ref: 'Land', required: true },

  source: {
    type: String,
    enum: ['mahabhulekh', 'mahabhunaksha', 'manual_upload'],
    required: true
  },

  // What the user entered on the form
  userInput: {
    ownerName: String,
    surveyNumber: String,
    area: Number,
    areaUnit: String,
    district: String,
    taluka: String,
    village: String
  },

  // OCR-extracted data from the uploaded image
  ocrExtracted: {
    ownerName: String,
    surveyNumber: String,
    area: Number,
    areaUnit: String,
    rawText: String         // full OCR text dump
  },

  // Data scraped from Mahabhulekh HTML
  scrapedData: {
    owners: [String],
    area: String,
    encumbrances: String
  },

  // Comparison results
  comparison: {
    nameMatch: { score: { type: Number }, passed: { type: Boolean } },
    surveyMatch: { score: { type: Number }, passed: { type: Boolean } },
    areaMatch: {
      score: { type: Number },
      passed: { type: Boolean },
      tolerance: { type: Number, default: 0.05 }
    },
    encumbranceFlag: { type: Boolean, default: false },
    overallScore: { type: Number, default: 0 },
    verdict: {
      type: String,
      enum: ['auto_pass', 'auto_fail', 'officer_review']
    }
  },

  // IPFS evidence CIDs
  cids: {
    htmlCID: String,         // Mahabhulekh HTML snapshot
    pdfCID: String,          // Generated PDF
    imageCID: String,        // Original uploaded 7/12 image
    ocrResultCID: String     // OCR output pinned for audit trail
  }
}, {
  timestamps: true
});

verificationResultSchema.index({ land: 1 });
verificationResultSchema.index({ 'comparison.verdict': 1 });

module.exports = mongoose.model('VerificationResult', verificationResultSchema);