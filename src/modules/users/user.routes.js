const express = require('express');
const userController = require('./user.controller');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');
const { PERMISSIONS } = require('../../utils/constants');
const {
  createUserSchema,
  updateUserSchema,
  getUsersSchema,
  getUserByIdSchema
} = require('./user.validator');

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  authorize(PERMISSIONS.USER_VIEW),
  validate(getUsersSchema),
  userController.getUsers
);

router.get(
  '/:id',
  validate(getUserByIdSchema),
  userController.getUserById
);

router.post(
  '/',
  authorize(PERMISSIONS.USER_CREATE),
  validate(createUserSchema),
  userController.createUser
);

router.patch(
  '/:id',
  authorize(PERMISSIONS.USER_UPDATE),
  validate(updateUserSchema),
  userController.updateUser
);

router.delete(
  '/:id',
  authorize(PERMISSIONS.USER_DELETE),
  validate(getUserByIdSchema),
  userController.deleteUser
);

module.exports = router;
