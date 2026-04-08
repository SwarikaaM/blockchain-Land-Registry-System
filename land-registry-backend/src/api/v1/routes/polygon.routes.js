const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/polygon.controller');
const { authenticate } = require('../../../middleware/auth.middleware');
const { requireRole } = require('../../../middleware/role.middleware');
const { validate } = require('../../../middleware/validate.middleware');
const { savePolygon, idParam } = require('../../../validators/polygon.validator');

router.post('/:id/polygon', authenticate, requireRole('seller'), validate(idParam, 'params'), validate(savePolygon), controller.savePolygon);
router.get('/:id/polygon', authenticate, validate(idParam, 'params'), controller.getPolygon);
router.post('/:id/polygon/validate', authenticate, validate(idParam, 'params'), controller.validatePolygon);

module.exports = router;
