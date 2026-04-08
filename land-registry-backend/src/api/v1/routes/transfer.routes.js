const express = require('express');
const router = express.Router();
const controller = require('../../../controllers/transfer.controller');
const { authenticate } = require('../../../middleware/auth.middleware');
const { validate } = require('../../../middleware/validate.middleware');
const { createOffer, coownerConsent, finalize, idParam } = require('../../../validators/transfer.validator');

router.post('/offer', authenticate, validate(createOffer), controller.createOffer);
router.post('/:id/accept', authenticate, validate(idParam, 'params'), controller.acceptOffer);
router.post('/:id/reject', authenticate, validate(idParam, 'params'), controller.rejectOffer);
router.get('/my', authenticate, controller.getMyTransfers);
router.post('/:id/coowner-consent', authenticate, validate(idParam, 'params'), validate(coownerConsent), controller.coownerConsent);
router.post('/:id/finalize', authenticate, validate(idParam, 'params'), validate(finalize), controller.finalize);

module.exports = router;
