const Joi = require('joi');

// POST /land/:id/polygon
const savePolygon = Joi.object({
  geoJson: Joi.object().required()
    .messages({ 'any.required': 'GeoJSON object is required' }),
  source: Joi.string()
    .valid('user_drawn', 'bhuvan_import', 'mahabhunaksha')
    .default('user_drawn')
});

// Params — :id
const idParam = Joi.object({
  id: Joi.string().hex().length(24).required()
});

module.exports = {
  savePolygon,
  idParam
};
