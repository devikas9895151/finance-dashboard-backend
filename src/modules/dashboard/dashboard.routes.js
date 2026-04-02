const express = require('express');
const dashboardController = require('./dashboard.controller');
const authenticate = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');
const { PERMISSIONS } = require('../../utils/constants');

const router = express.Router();

router.use(authenticate);

router.get(
  '/summary',
  authorize(PERMISSIONS.DASHBOARD_VIEW),
  dashboardController.getSummary
);

router.get(
  '/recent',
  authorize(PERMISSIONS.DASHBOARD_VIEW),
  dashboardController.getRecentActivity
);

router.get(
  '/trends',
  authorize(PERMISSIONS.DASHBOARD_VIEW),
  dashboardController.getTrends
);

router.get(
  '/analytics',
  authorize(PERMISSIONS.DASHBOARD_ANALYTICS),
  dashboardController.getAnalytics
);

module.exports = router;
