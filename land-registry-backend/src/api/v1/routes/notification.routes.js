const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/notification.controller');
const { authenticate } = require('../../../middleware/auth.middleware');

router.get('/', authenticate, controller.list);
router.put('/:id/read', authenticate, controller.markRead);
router.put('/read-all', authenticate, controller.markAllRead);

module.exports = router;
