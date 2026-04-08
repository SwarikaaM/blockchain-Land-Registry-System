/**
 * Simple in-memory rate limiter.
 * For production, switch to Redis-based rate limiting.
 */

const rateLimitStore = new Map();

/**
 * Rate limiter middleware factory.
 *
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 min)
 * @param {number} options.max - Max requests per window (default: 100)
 * @param {string} options.message - Error message
 * @returns {Function} Express middleware
 */
const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000,   // 15 minutes
    max = 100,
    message = 'Too many requests. Please try again later.'
  } = options;

  // Cleanup expired entries periodically
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore) {
      if (now - entry.startTime > windowMs) {
        rateLimitStore.delete(key);
      }
    }
  }, windowMs);

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    if (!entry || (now - entry.startTime > windowMs)) {
      entry = { count: 0, startTime: now };
      rateLimitStore.set(key, entry);
    }

    entry.count++;

    // Set rate limit headers
    res.set('X-RateLimit-Limit', max);
    res.set('X-RateLimit-Remaining', Math.max(0, max - entry.count));
    res.set('X-RateLimit-Reset', new Date(entry.startTime + windowMs).toISOString());

    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil((entry.startTime + windowMs - now) / 1000)
      });
    }

    next();
  };
};

// Pre-configured limiters
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many auth attempts' });
const uploadLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: 'Too many uploads' });

module.exports = { rateLimit, apiLimiter, authLimiter, uploadLimiter };
