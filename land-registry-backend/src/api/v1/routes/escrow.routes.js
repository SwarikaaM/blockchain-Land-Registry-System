const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/escrow.controller');
const { authenticate } = require('../../../middleware/auth.middleware');

router.post('/lock', authenticate, controller.lockFunds);
router.post('/:id/release', authenticate, controller.releaseFunds);
router.post('/:id/refund', authenticate, controller.refundFunds);
router.get('/:id/status', authenticate, controller.getStatus);

module.exports = router;
