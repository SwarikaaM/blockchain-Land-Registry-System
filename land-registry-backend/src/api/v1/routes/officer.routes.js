const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/officer.controller');
const { authenticate } = require('../../../middleware/auth.middleware');
const { requireRole } = require('../../../middleware/role.middleware');
const { validate } = require('../../../middleware/validate.middleware');
const { approveCase, rejectCase, listCasesQuery, idParam } = require('../../../validators/officer.validator');

router.get('/cases', authenticate, requireRole('officer', 'admin'), validate(listCasesQuery, 'query'), controller.listCases);
router.get('/cases/:id', authenticate, requireRole('officer', 'admin'), validate(idParam, 'params'), controller.getCaseById);
router.post('/cases/:id/approve', authenticate, requireRole('officer', 'admin'), validate(idParam, 'params'), validate(approveCase), controller.approveCase);
router.post('/cases/:id/reject', authenticate, requireRole('officer', 'admin'), validate(idParam, 'params'), validate(rejectCase), controller.rejectCase);

module.exports = router;
