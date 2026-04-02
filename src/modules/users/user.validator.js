const Joi = require('joi');
const { ROLES, USER_STATUS } = require('../../utils/constants');

const createUserSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    name: Joi.string().min(2).max(100).required(),
    role: Joi.string().valid(...Object.values(ROLES)).default('viewer'),
    status: Joi.string().valid(...Object.values(USER_STATUS)).default('active')
  }),
  query: Joi.object({}),
  params: Joi.object({})
});

const updateUserSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100),
    role: Joi.string().valid(...Object.values(ROLES)),
    status: Joi.string().valid(...Object.values(USER_STATUS)),
    password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  }).min(1),
  query: Joi.object({}),
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  })
});

const getUsersSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    role: Joi.string().valid(...Object.values(ROLES)),
    status: Joi.string().valid(...Object.values(USER_STATUS)),
    search: Joi.string().max(100)
  }),
  params: Joi.object({})
});

const getUserByIdSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({}),
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  })
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUsersSchema,
  getUserByIdSchema
};
