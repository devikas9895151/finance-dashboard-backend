const ROLES = {
  VIEWER: 'viewer',
  ANALYST: 'analyst',
  ADMIN: 'admin'
};

const ROLE_HIERARCHY = {
  [ROLES.VIEWER]: 1,
  [ROLES.ANALYST]: 2,
  [ROLES.ADMIN]: 3
};

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

const RECORD_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense'
};

const CATEGORIES = [
  'salary',
  'freelance',
  'investments',
  'rent',
  'utilities',
  'groceries',
  'transportation',
  'entertainment',
  'healthcare',
  'education',
  'other'
];

const PERMISSIONS = {
  // User permissions
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Record permissions
  RECORD_VIEW: 'record:view',
  RECORD_CREATE: 'record:create',
  RECORD_UPDATE: 'record:update',
  RECORD_DELETE: 'record:delete',
  
  // Dashboard permissions
  DASHBOARD_VIEW: 'dashboard:view',
  DASHBOARD_ANALYTICS: 'dashboard:analytics'
};

const ROLE_PERMISSIONS = {
  [ROLES.VIEWER]: [
    PERMISSIONS.DASHBOARD_VIEW
  ],
  [ROLES.ANALYST]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_ANALYTICS,
    PERMISSIONS.RECORD_VIEW
  ],
  [ROLES.ADMIN]: Object.values(PERMISSIONS)
};

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
  USER_STATUS,
  RECORD_TYPES,
  CATEGORIES,
  PERMISSIONS,
  ROLE_PERMISSIONS
};
