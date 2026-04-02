const Joi = require('joi');

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().min(6).required()
  }),
  query: Joi.object({}),
  params: Joi.object({})
});

const registerSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }),
    name: Joi.string().min(2).max(100).required()
  }),
  query: Joi.object({}),
  params: Joi.object({})
});

const refreshTokenSchema = Joi.object({
  body: Joi.object({
    refreshToken: Joi.string().required()
  }),
  query: Joi.object({}),
  params: Joi.object({})
});

module.exports = {
  loginSchema,
  registerSchema,
  refreshTokenSchema
};
