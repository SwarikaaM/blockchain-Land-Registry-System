const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/webhook.controller');

// Webhooks are unauthenticated — they use shared secrets instead
router.post('/pinata', controller.pinataWebhook);
router.post('/blockchain', controller.blockchainWebhook);

module.exports = router;
