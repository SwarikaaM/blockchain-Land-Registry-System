require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  REDIS_URL: process.env.REDIS_URL,
  PINATA_KEY: process.env.PINATA_KEY,
  PINATA_SECRET: process.env.PINATA_SECRET
};