const userService = require('./user.service');
const ApiResponse = require('../../utils/ApiResponse');

class UserController {
  async getUsers(req, res, next) {
    try {
      const { users, pagination } = await userService.getUsers(req.user, req.query);
      ApiResponse.paginated(res, users, pagination);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getUserById(req.user, parseInt(req.params.id));
      ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const user = await userService.createUser(req.user, req.body);
      ApiResponse.created(res, user, 'User created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.user, parseInt(req.params.id), req.body);
      ApiResponse.success(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.deleteUser(req.user, parseInt(req.params.id));
      ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
