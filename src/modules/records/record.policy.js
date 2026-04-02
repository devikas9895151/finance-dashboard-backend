const ApiError = require('../../utils/ApiError');
const { ROLES } = require('../../utils/constants');

class RecordPolicy {
  canView(actor, record) {
    // Admin and analysts can view all records
    if ([ROLES.ADMIN, ROLES.ANALYST].includes(actor.role)) {
      return true;
    }
    // Others can view their own records
    return actor.id === record.user_id;
  }

  canCreate(actor) {
    return actor.role === ROLES.ADMIN;
  }

  canUpdate(actor, record) {
    return actor.role === ROLES.ADMIN;
  }

  canDelete(actor, record) {
    return actor.role === ROLES.ADMIN;
  }

  assertCanView(actor, record) {
    if (!this.canView(actor, record)) {
      throw ApiError.forbidden('You do not have permission to view this record');
    }
  }

  assertCanCreate(actor) {
    if (!this.canCreate(actor)) {
      throw ApiError.forbidden('Only admins can create records');
    }
  }

  assertCanUpdate(actor, record) {
    if (!this.canUpdate(actor, record)) {
      throw ApiError.forbidden('Only admins can update records');
    }
  }

  assertCanDelete(actor, record) {
    if (!this.canDelete(actor, record)) {
      throw ApiError.forbidden('Only admins can delete records');
    }
  }

  getViewFilter(actor) {
    // Admin and analysts see all records
    if ([ROLES.ADMIN, ROLES.ANALYST].includes(actor.role)) {
      return {};
    }
    // Others see only their own
    return { userId: actor.id };
  }
}

module.exports = new RecordPolicy();
