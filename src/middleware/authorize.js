const ApiError = require('../utils/ApiError');
const { ROLE_PERMISSIONS } = require('../utils/constants');

const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
      
      const hasPermission = requiredPermissions.every(
        permission => userPermissions.includes(permission)
      );

      if (!hasPermission) {
        throw ApiError.forbidden(
          `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw ApiError.forbidden(
          `Role '${req.user.role}' is not authorized for this action`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { authorize, authorizeRoles };
