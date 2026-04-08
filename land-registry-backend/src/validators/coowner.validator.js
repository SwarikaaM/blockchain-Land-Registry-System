const Joi = require('joi');

// POST /land/:id/coowners
const addCoOwner = Joi.object({
  fullName: Joi.string().trim().min(2).max(200).required(),
  walletAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .allow(null, '')
    .messages({ 'string.pattern.base': 'Invalid Ethereum wallet address' }),
  sharePercent: Joi.number().min(0).max(100).required(),
  isOnline: Joi.boolean().default(true)
});

// PUT /land/:id/coowners/:coOwnerId/sign
const signNoc = Joi.object({
  signature: Joi.string().trim().required()
});

// Params
const coOwnerParams = Joi.object({
  id: Joi.string().hex().length(24).required(),
  coOwnerId: Joi.string().hex().length(24).required()
});

const landIdParam = Joi.object({
  id: Joi.string().hex().length(24).required()
});

module.exports = {
  addCoOwner,
  signNoc,
  coOwnerParams,
  landIdParam
};
