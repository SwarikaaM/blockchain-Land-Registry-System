const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/verification.controller');
const { authenticate } = require('../../../middleware/auth.middleware');
const { uploadSingle } = require('../../../middleware/upload.middleware');

router.post('/mahabhulekh', controller.verifyLand);  // No auth — legacy endpoint
router.post('/verify', controller.verifyLand);         // Alias for backwards compat
router.post('/document-compare', authenticate, uploadSingle, controller.documentCompare);
router.get('/:landId/result', authenticate, controller.getResult);
router.post('/:landId/retry', authenticate, controller.retry);

module.exports = router;