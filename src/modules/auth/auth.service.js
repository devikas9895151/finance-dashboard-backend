const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../../utils/ApiError');
const userRepository = require('../users/user.repository');

class AuthService {
  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw ApiError.forbidden('Account is inactive. Please contact an administrator.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const tokens = this.generateTokens(user);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      ...tokens
    };
  }

  async register(userData) {
    const existingUser = await userRepository.findByEmail(userData.email);
    
    if (existingUser) {
      throw ApiError.conflict('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);
    
    const user = await userRepository.create({
      email: userData.email,
      password_hash: passwordHash,
      name: userData.name,
      role: 'viewer', // Default role for self-registration
      status: 'active'
    });

    const tokens = this.generateTokens(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      ...tokens
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await userRepository.findById(decoded.userId);
      
      if (!user || user.status !== 'active') {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }
  }

  generateTokens(user) {
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    return { accessToken, refreshToken };
  }
}

module.exports = new AuthService();
