const express = require('express');
const router = express.Router();

/**
 * API v1 Router — aggregates all route modules.
 * Currently routes are mounted directly in server.js.
 * This module can be used as an alternative centralized mount point.
 */

router.use('/auth', require('./routes/auth.routes'));
router.use('/profile', require('./routes/profile.routes'));
router.use('/land', require('./routes/land.routes'));
router.use('/land', require('./routes/coowner.routes'));     // /land/:id/coowners
router.use('/land', require('./routes/polygon.routes'));     // /land/:id/polygon
router.use('/ipfs', require('./routes/ipfs.routes'));
router.use('/verification', require('./routes/verification.routes'));
router.use('/officer', require('./routes/officer.routes'));
router.use('/transfer', require('./routes/transfer.routes'));
router.use('/escrow', require('./routes/escrow.routes'));
router.use('/notifications', require('./routes/notification.routes'));
router.use('/webhook', require('./routes/webhook.routes'));

module.exports = router;
