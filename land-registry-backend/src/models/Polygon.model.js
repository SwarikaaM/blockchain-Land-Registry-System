const mongoose = require('mongoose');
const { Schema } = mongoose;

const polygonSchema = new Schema({
  land: { type: Schema.Types.ObjectId, ref: 'Land', required: true },

  geoJson: { type: Object, required: true },   // GeoJSON Feature
  areaSqm: { type: Number },                   // computed from polygon via Turf.js

  source: {
    type: String,
    enum: ['user_drawn', 'bhuvan_import', 'mahabhunaksha'],
    default: 'user_drawn'
  },

  ipfsCID: String,                              // pinned GeoJSON on IPFS

  // Spatial validation warnings (advisory only)
  warnings: [{
    type: {
      type: String,
      enum: ['overlap', 'area_mismatch', 'boundary_irregular']
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info'
    },
    message: String,
    data: Schema.Types.Mixed
  }],

  skipped: { type: Boolean, default: false }    // true if area < 500 sqm
}, {
  timestamps: true
});

polygonSchema.index({ land: 1 });

module.exports = mongoose.model('Polygon', polygonSchema);
