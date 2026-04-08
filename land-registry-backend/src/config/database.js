const mongoose = require('mongoose');
const { MONGO_URI } = require('./index');

exports.connectDB = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
};