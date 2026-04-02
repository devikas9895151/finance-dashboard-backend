const express = require('express');
const recordController = require('./record.controller');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');
const { PERMISSIONS } = require('../../utils/constants');
const {
  createRecordSchema,
  updateRecordSchema,
  getRecordsSchema,
  getRecordByIdSchema
} = require('./record.validator');

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  authorize(PERMISSIONS.RECORD_VIEW),
  validate(getRecordsSchema),
  recordController.getRecords
);

router.get(
  '/:id',
  authorize(PERMISSIONS.RECORD_VIEW),
  validate(getRecordByIdSchema),
  recordController.getRecordById
);

router.post(
  '/',
  authorize(PERMISSIONS.RECORD_CREATE),
  validate(createRecordSchema),
  recordController.createRecord
);

router.patch(
  '/:id',
  authorize(PERMISSIONS.RECORD_UPDATE),
  validate(updateRecordSchema),
  recordController.updateRecord
);

router.delete(
  '/:id',
  authorize(PERMISSIONS.RECORD_DELETE),
  validate(getRecordByIdSchema),
  recordController.deleteRecord
);

module.exports = router;
