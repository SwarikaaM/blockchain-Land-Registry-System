const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  label: String,
  value: String
});

module.exports = mongoose.model('DropdownCache', schema);