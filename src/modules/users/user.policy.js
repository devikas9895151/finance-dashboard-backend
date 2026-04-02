const ApiError = require('../../utils/ApiError');
const { ROLES, ROLE_HIERARCHY } = require('../../utils/constants');

class UserPolicy {
  canCreate(actor) {
    return actor.role === ROLES.ADMIN;
  }

  canUpdate(actor, targetUser) {
    if (actor.role !== ROLES.ADMIN) {
      return false;
    }
    // Admins cannot modify other admins (except themselves)
    if (targetUser.role === ROLES.ADMIN && actor.id !== targetUser.id) {
      return false;
    }
    return true;
  }

  canDelete(actor, targetUser) {
    if (actor.role !== ROLES.ADMIN) {
      return false;
    }
    // Cannot delete yourself
    if (actor.id === targetUser.id) {
      return false;
    }
    // Cannot delete other admins
    if (targetUser.role === ROLES.ADMIN) {
      return false;
    }
    return true;
  }

  canChangeRole(actor, targetUser, newRole) {
    if (actor.role !== ROLES.ADMIN) {
      return false;
    }
    // Cannot change your own role
    if (actor.id === targetUser.id) {
      return false;
    }
    // Cannot promote to admin or demote from admin
    if (newRole === ROLES.ADMIN || targetUser.role === ROLES.ADMIN) {
      return false;
    }
    return true;
  }

  canViewList(actor) {
    return actor.role === ROLES.ADMIN;
  }

  assertCanCreate(actor) {
    if (!this.canCreate(actor)) {
      throw ApiError.forbidden('Only admins can create users');
    }
  }

  assertCanUpdate(actor, targetUser) {
    if (!this.canUpdate(actor, targetUser)) {
      throw ApiError.forbidden('You do not have permission to update this user');
    }
  }

  assertCanDelete(actor, targetUser) {
    if (!this.canDelete(actor, targetUser)) {
      throw ApiError.forbidden('You do not have permission to delete this user');
    }
  }
}

module.exports = new UserPolicy();
