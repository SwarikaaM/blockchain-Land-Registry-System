/**
 * Role-based access control middleware.
 *
 * Usage:
 *   router.get('/cases', authenticate, requireRole('officer', 'admin'), handler)
 *
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
    }

    next();
  };
};

/**
 * Require the user to be the owner of the resource or have specific roles.
 * Checks req.user._id against the provided owner ID.
 */
const requireOwnerOrRole = (getOwnerId, ...fallbackRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const ownerId = getOwnerId(req);
    const isOwner = ownerId && req.user._id.toString() === ownerId.toString();
    const hasRole = fallbackRoles.includes(req.user.role);

    if (!isOwner && !hasRole) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You must be the resource owner or have an authorized role.'
      });
    }

    next();
  };
};

module.exports = { requireRole, requireOwnerOrRole };
