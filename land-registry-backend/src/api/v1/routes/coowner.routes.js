const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/coowner.controller');
const { authenticate } = require('../../../middleware/auth.middleware');
const { requireRole } = require('../../../middleware/role.middleware');
const { uploadSingle } = require('../../../middleware/upload.middleware');
const { validate } = require('../../../middleware/validate.middleware');
const { addCoOwner, signNoc, coOwnerParams, landIdParam } = require('../../../validators/coowner.validator');

router.post('/:id/coowners', authenticate, requireRole('seller'), validate(landIdParam, 'params'), validate(addCoOwner), controller.addCoOwner);
router.get('/:id/coowners', authenticate, validate(landIdParam, 'params'), controller.listCoOwners);
router.post('/:id/coowners/:coOwnerId/noc', authenticate, validate(coOwnerParams, 'params'), uploadSingle, controller.uploadNoc);
router.put('/:id/coowners/:coOwnerId/sign', authenticate, validate(coOwnerParams, 'params'), validate(signNoc), controller.signNoc);

module.exports = router;
