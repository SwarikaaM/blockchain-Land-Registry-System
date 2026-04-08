/**
 * Wraps async route handlers to automatically catch errors
 * and forward them to Express error handler middleware.
 */
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
