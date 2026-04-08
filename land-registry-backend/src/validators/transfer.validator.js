const Joi = require('joi');

// POST /transfer/offer
const createOffer = Joi.object({
  landId: Joi.string().hex().length(24).required(),
  price: Joi.number().positive().required(),
  currency: Joi.string().valid('POL', 'MATIC', 'ETH', 'INR').default('POL')
});

// POST /transfer/:id/accept — no body needed
const acceptOffer = Joi.object({});

// POST /transfer/:id/reject — no body needed
const rejectOffer = Joi.object({});

// POST /transfer/:id/coowner-consent
const coownerConsent = Joi.object({
  coOwnerId: Joi.string().hex().length(24).required(),
  approve: Joi.boolean().required(),
  signature: Joi.string().when('approve', {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.string().allow('', null)
  })
});

// POST /transfer/:id/finalize
const finalize = Joi.object({
  txHash: Joi.string().allow('', null)
});

// Params — :id
const idParam = Joi.object({
  id: Joi.string().hex().length(24).required()
});

module.exports = {
  createOffer,
  acceptOffer,
  rejectOffer,
  coownerConsent,
  finalize,
  idParam
};
