const dashboardService = require('./dashboard.service');
const ApiResponse = require('../../utils/ApiResponse');

class DashboardController {
  async getSummary(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const summary = await dashboardService.getSummary(req.user, { startDate, endDate });
      ApiResponse.success(res, summary);
    } catch (error) {
      next(error);
    }
  }

  async getRecentActivity(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const activity = await dashboardService.getRecentActivity(req.user, limit);
      ApiResponse.success(res, activity);
    } catch (error) {
      next(error);
    }
  }

  async getTrends(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const trends = await dashboardService.getTrends(req.user, { startDate, endDate });
      ApiResponse.success(res, trends);
    } catch (error) {
      next(error);
    }
  }

  async getAnalytics(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await dashboardService.getAnalytics(req.user, { startDate, endDate });
      ApiResponse.success(res, analytics);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
