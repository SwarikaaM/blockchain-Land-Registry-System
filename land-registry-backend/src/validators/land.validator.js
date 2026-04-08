const Joi = require('joi');

// POST /land/register
const registerLand = Joi.object({
  district: Joi.string().trim().required(),
  districtValue: Joi.string().trim().allow(''),
  taluka: Joi.string().trim().required(),
  talukaValue: Joi.string().trim().allow(''),
  village: Joi.string().trim().required(),
  villageValue: Joi.string().trim().allow(''),
  surveyNumber: Joi.string().trim().required(),
  gatNumber: Joi.string().trim().allow(''),
  area: Joi.number().positive().required(),
  areaUnit: Joi.string().valid('sqm', 'hectare', 'acre', 'guntha').default('sqm'),
  encumbrances: Joi.string().allow('').default(''),
  boundaryDescription: Joi.string().allow('').default('')
});

// PUT /land/:id
const updateLand = Joi.object({
  location: Joi.object({
    district: Joi.string().trim(),
    districtValue: Joi.string().trim().allow(''),
    taluka: Joi.string().trim(),
    talukaValue: Joi.string().trim().allow(''),
    village: Joi.string().trim(),
    villageValue: Joi.string().trim().allow(''),
    surveyNumber: Joi.string().trim(),
    gatNumber: Joi.string().trim().allow('')
  }),
  area: Joi.object({
    value: Joi.number().positive(),
    unit: Joi.string().valid('sqm', 'hectare', 'acre', 'guntha')
  }),
  encumbrances: Joi.string().allow(''),
  boundaryDescription: Joi.string().allow('')
}).min(1);

// POST /land/:id/upload-documents
const uploadDocuments = Joi.object({
  sevenTwelveCID: Joi.string().trim(),
  mahabhulekhSnapshotCID: Joi.string().trim(),
  mahabhunakshaSnapshotCID: Joi.string().trim()
}).min(1);

// PUT /land/:id/status
const updateStatus = Joi.object({
  status: Joi.string()
    .valid(
      'draft', 'documents_uploaded', 'verification_pending', 'verification_passed',
      'verification_failed', 'officer_review', 'registered', 'listed',
      'transfer_pending', 'transferred'
    )
    .required()
});

// Params — :id
const idParam = Joi.object({
  id: Joi.string().hex().length(24).required()
});

module.exports = {
  registerLand,
  updateLand,
  uploadDocuments,
  updateStatus,
  idParam
};
