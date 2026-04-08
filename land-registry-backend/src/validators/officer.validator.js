const Joi = require('joi');

// POST /officer/cases/:id/approve
const approveCase = Joi.object({
  justification: Joi.string().trim().max(2000).allow('').default(''),
  signatureHash: Joi.string().trim().allow('').default('')
});

// POST /officer/cases/:id/reject
const rejectCase = Joi.object({
  justification: Joi.string().trim().max(2000).required()
    .messages({ 'any.required': 'Justification is required when rejecting a case' }),
  signatureHash: Joi.string().trim().allow('').default('')
});

// Query params for GET /officer/cases
const listCasesQuery = Joi.object({
  status: Joi.string().valid('queued', 'in_review', 'approved', 'rejected', 'escalated'),
  type: Joi.string().valid('verification_review', 'transfer_review', 'dispute'),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string()
});

// Params — :id
const idParam = Joi.object({
  id: Joi.string().hex().length(24).required()
});

module.exports = {
  approveCase,
  rejectCase,
  listCasesQuery,
  idParam
};
