const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/profile.controller');
const { authenticate } = require('../../../middleware/auth.middleware');

router.get('/', authenticate, controller.getProfile);
router.put('/', authenticate, controller.updateProfile);
router.post('/kyc', authenticate, controller.submitKyc);

module.exports = router;
