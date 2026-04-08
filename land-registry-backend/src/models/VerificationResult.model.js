const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  input: Object,
  parsed: Object,
  result: Object,
  cids: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VerificationResult', schema);