const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/ipfs.controller');
const { authenticate } = require('../../../middleware/auth.middleware');
const { uploadSingle } = require('../../../middleware/upload.middleware');
const { uploadLimiter } = require('../../../middleware/rateLimit.middleware');

router.post('/upload', authenticate, uploadLimiter, uploadSingle, controller.upload);
router.get('/:cid', controller.fetch);
router.post('/extract-and-compare', authenticate, uploadLimiter, uploadSingle, controller.extractAndCompare);

module.exports = router;
