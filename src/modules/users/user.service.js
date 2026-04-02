const bcrypt = require('bcrypt');
const userRepository = require('./user.repository');
const userPolicy = require('./user.policy');
const ApiError = require('../../utils/ApiError');

class UserService {
  async getUsers(actor, filters) {
    if (!userPolicy.canViewList(actor)) {
      throw ApiError.forbidden('You do not have permission to view users');
    }

    const page = parseInt(filters.page) || 1;
    const limit = Math.min(parseInt(filters.limit) || 20, 100);
    const offset = (page - 1) * limit;

    const { users, total } = await userRepository.findAll({
      ...filters,
      limit,
      offset
    });

    return {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      })),
      pagination: { page, limit, total }
    };
  }

  async getUserById(actor, userId) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Users can view their own profile, admins can view any
    if (actor.id !== user.id && actor.role !== 'admin') {
      throw ApiError.forbidden('You do not have permission to view this user');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }

  async createUser(actor, userData) {
    userPolicy.assertCanCreate(actor);

    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw ApiError.conflict('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);

    const user = await userRepository.create({
      email: userData.email,
      password_hash: passwordHash,
      name: userData.name,
      role: userData.role || 'viewer',
      status: userData.status || 'active'
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: user.created_at
    };
  }

  async updateUser(actor, userId, updates) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    userPolicy.assertCanUpdate(actor, user);

    if (updates.role && updates.role !== user.role) {
      if (!userPolicy.canChangeRole(actor, user, updates.role)) {
        throw ApiError.forbidden('You cannot change this user\'s role');
      }
    }

    const updateData = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.role) updateData.role = updates.role;
    if (updates.status) updateData.status = updates.status;
    if (updates.password) {
      updateData.password_hash = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await userRepository.update(userId, updateData);

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      status: updatedUser.status,
      updatedAt: updatedUser.updated_at
    };
  }

  async deleteUser(actor, userId) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    userPolicy.assertCanDelete(actor, user);

    await userRepository.delete(userId);
    
    return { message: 'User deleted successfully' };
  }
}

module.exports = new UserService();
