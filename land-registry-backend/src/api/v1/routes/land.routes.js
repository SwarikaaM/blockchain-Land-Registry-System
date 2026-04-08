const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/land.controller');
const { authenticate } = require('../../../middleware/auth.middleware');
const { requireRole } = require('../../../middleware/role.middleware');
const { validate } = require('../../../middleware/validate.middleware');
const { registerLand, updateLand, uploadDocuments, updateStatus, idParam } = require('../../../validators/land.validator');

router.post('/register', authenticate, requireRole('seller'), validate(registerLand), controller.register);
router.get('/', authenticate, controller.list);
router.get('/search', authenticate, controller.search);
router.get('/:id', authenticate, validate(idParam, 'params'), controller.getById);
router.put('/:id', authenticate, requireRole('seller'), validate(idParam, 'params'), validate(updateLand), controller.update);
router.post('/:id/upload-documents', authenticate, requireRole('seller'), validate(idParam, 'params'), validate(uploadDocuments), controller.uploadDocuments);
router.put('/:id/status', authenticate, requireRole('officer', 'admin'), validate(idParam, 'params'), validate(updateStatus), controller.updateStatus);

module.exports = router;
