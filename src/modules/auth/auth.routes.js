const express = require('express');
const authController = require('./auth.controller');

// ✅ FIXED IMPORTS
const validate = require('../../middleware/validate'); 
const authenticate = require('../../middleware/authenticate');

const { loginSchema, registerSchema, refreshTokenSchema } = require('./auth.validator');

const router = express.Router();

// ✅ ROUTES
router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.register);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.get('/me', authenticate, authController.me);

module.exports = router;