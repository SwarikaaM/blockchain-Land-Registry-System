const { Queue } = require('bullmq');
const redis = require('../config/redis');

exports.verifyQueue = new Queue('verify', { connection: redis });