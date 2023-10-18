const Joi = require('joi');

module.exports = (schema) => (req, res, next) => {
  const errors = [];
  Object.keys(schema).forEach((type) => {
    let testSchema = schema[type];
    if (!Joi.isSchema(testSchema)) {
      testSchema = Joi.object(testSchema);
    }
    const validated = testSchema.validate(req[type], { abortEarly: false });
    if (validated.error) {
      validated.error.details.forEach((error) => {
        errors.push({
          title: 'Bad Parameter',
          details: error.message
        });
      });
    }
  });
  if (errors.length) {
    return res.status(400).json({
      status_code: 400,
      message: 'error',
      error: errors,
    });
  }
  return next();
};
