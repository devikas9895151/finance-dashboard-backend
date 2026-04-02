const authService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      ApiResponse.created(res, result, 'Registration successful');
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);
      ApiResponse.success(res, tokens, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      ApiResponse.success(res, req.user, 'Current user retrieved');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
