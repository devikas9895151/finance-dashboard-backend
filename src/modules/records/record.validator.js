const Joi = require('joi');
const { RECORD_TYPES, CATEGORIES } = require('../../utils/constants');

const createRecordSchema = Joi.object({
  body: Joi.object({
    amount: Joi.number().positive().precision(2).required(),
    type: Joi.string().valid(...Object.values(RECORD_TYPES)).required(),
    category: Joi.string().valid(...CATEGORIES).required(),
    date: Joi.date().iso().max('now').required(),
    description: Joi.string().max(500).allow('', null)
  }),
  query: Joi.object({}),
  params: Joi.object({})
});

const updateRecordSchema = Joi.object({
  body: Joi.object({
    amount: Joi.number().positive().precision(2),
    type: Joi.string().valid(...Object.values(RECORD_TYPES)),
    category: Joi.string().valid(...CATEGORIES),
    date: Joi.date().iso().max('now'),
    description: Joi.string().max(500).allow('', null)
  }).min(1),
  query: Joi.object({}),
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  })
});

const getRecordsSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    type: Joi.string().valid(...Object.values(RECORD_TYPES)),
    category: Joi.string().valid(...CATEGORIES),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')),
    minAmount: Joi.number().positive(),
    maxAmount: Joi.number().positive().min(Joi.ref('minAmount')),
    search: Joi.string().max(100),
    sortBy: Joi.string().valid('date', 'amount', 'created_at').default('date'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
  }),
  params: Joi.object({})
});

const getRecordByIdSchema = Joi.object({
  body: Joi.object({}),
  query: Joi.object({}),
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  })
});

module.exports = {
  createRecordSchema,
  updateRecordSchema,
  getRecordsSchema,
  getRecordByIdSchema
};
