const IORedis = require('ioredis');
const { REDIS_URL } = require('./index');
const logger = require('../utils/logger');

let client;
let memoryStore = {};

try {
  client = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null; // stop retrying
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true,
  });

  client.on('error', (err) => {
    if (!client._fallbackLogged) {
      logger.warn('Redis unavailable, using in-memory fallback', { error: err.message });
      client._fallbackLogged = true;
    }
  });

  client.connect().catch(() => {
    logger.warn('Redis connection failed, using in-memory fallback');
  });
} catch {
  client = null;
}

// In-memory fallback wrapper
const fallback = {
  async get(key) {
    if (client && client.status === 'ready') return client.get(key);
    const item = memoryStore[key];
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) { delete memoryStore[key]; return null; }
    return item.value;
  },
  async set(key, value, ...args) {
    if (client && client.status === 'ready') return client.set(key, value, ...args);
    let expiry = null;
    if (args[0] === 'EX' && args[1]) expiry = Date.now() + args[1] * 1000;
    memoryStore[key] = { value, expiry };
    return 'OK';
  },
  async del(key) {
    if (client && client.status === 'ready') return client.del(key);
    delete memoryStore[key];
    return 1;
  },
};

module.exports = fallback;