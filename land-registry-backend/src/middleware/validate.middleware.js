const Joi = require('joi');

/**
 * Validation middleware factory.
 * Validates request body, params, or query against a Joi schema.
 *
 * Usage:
 *   router.post('/land', validate(landSchema), handler)
 *   router.get('/land/:id', validate(idParamSchema, 'params'), handler)
 *
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} source - 'body' | 'params' | 'query'
 * @returns {Function} Express middleware
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const details = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message.replace(/"/g, '')
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details
      });
    }

    // Replace with validated + stripped data
    req[source] = value;
    next();
  };
};

module.exports = { validate };
