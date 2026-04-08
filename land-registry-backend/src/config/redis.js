const IORedis = require('ioredis');
const { REDIS_URL } = require('./index');

module.exports = new IORedis(REDIS_URL);