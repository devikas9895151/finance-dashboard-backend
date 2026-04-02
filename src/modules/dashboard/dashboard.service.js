const recordRepository = require('../records/record.repository');
const { ROLES } = require('../../utils/constants');

class DashboardService {
  async getSummary(actor, filters = {}) {
    // Apply role-based filtering
    const queryFilters = this.applyRoleFilter(actor, filters);
    
    const { typeSummary, categorySummary } = await recordRepository.getSummary(queryFilters);

    const income = typeSummary.find(t => t.type === 'income') || { total: 0, count: 0, average: 0 };
    const expenses = typeSummary.find(t => t.type === 'expense') || { total: 0, count: 0, average: 0 };

    return {
      overview: {
        totalIncome: income.total || 0,
        totalExpenses: expenses.total || 0,
        netBalance: (income.total || 0) - (expenses.total || 0),
        totalTransactions: (income.count || 0) + (expenses.count || 0)
      },
      income: {
        total: income.total || 0,
        count: income.count || 0,
        average: income.average || 0
      },
      expenses: {
        total: expenses.total || 0,
        count: expenses.count || 0,
        average: expenses.average || 0
      },
      byCategory: this.formatCategorySummary(categorySummary)
    };
  }

  async getRecentActivity(actor, limit = 10) {
    const userId = [ROLES.ADMIN, ROLES.ANALYST].includes(actor.role) ? null : actor.id;
    
    let records;
    if (userId) {
      records = await recordRepository.getRecentRecords(userId, limit);
    } else {
      const { records: allRecords } = await recordRepository.findAll({
        limit,
        sortBy: 'date',
        sortOrder: 'DESC'
      });
      records = allRecords;
    }

    return records.map(record => ({
      id: record.id,
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date,
      description: record.description
    }));
  }

  async getTrends(actor, filters = {}) {
    const queryFilters = this.applyRoleFilter(actor, filters);
    
    const trends = await recordRepository.getMonthlyTrends(queryFilters);

    // Group by month
    const monthlyData = {};
    trends.forEach(row => {
      if (!monthlyData[row.month]) {
        monthlyData[row.month] = { month: row.month, income: 0, expenses: 0, net: 0 };
      }
      if (row.type === 'income') {
        monthlyData[row.month].income = row.total;
      } else {
        monthlyData[row.month].expenses = row.total;
      }
      monthlyData[row.month].net = monthlyData[row.month].income - monthlyData[row.month].expenses;
    });

    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  }

  async getAnalytics(actor, filters = {}) {
    const queryFilters = this.applyRoleFilter(actor, filters);
    
    const [summary, trends] = await Promise.all([
      recordRepository.getSummary(queryFilters),
      recordRepository.getMonthlyTrends(queryFilters)
    ]);

    // Calculate spending patterns
    const categoryBreakdown = this.formatCategorySummary(summary.categorySummary);
    
    // Find top spending categories
    const topExpenseCategories = categoryBreakdown.expenses
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Find top income sources
    const topIncomeCategories = categoryBreakdown.income
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // Calculate month-over-month changes
    const monthlyTrends = this.calculateMonthlyTrends(trends);

    return {
      topExpenseCategories,
      topIncomeCategories,
      monthlyTrends,
      savingsRate: this.calculateSavingsRate(summary.typeSummary)
    };
  }

  applyRoleFilter(actor, filters) {
    // Only non-admin/analyst users are restricted to their own data
    if (![ROLES.ADMIN, ROLES.ANALYST].includes(actor.role)) {
      return { ...filters, userId: actor.id };
    }
    return filters;
  }

  formatCategorySummary(categorySummary) {
    const income = [];
    const expenses = [];

    categorySummary.forEach(item => {
      const entry = {
        category: item.category,
        total: item.total,
        count: item.count
      };
      if (item.type === 'income') {
        income.push(entry);
      } else {
        expenses.push(entry);
      }
    });

    return { income, expenses };
  }

  calculateMonthlyTrends(trends) {
    const monthlyData = {};
    trends.forEach(row => {
      if (!monthlyData[row.month]) {
        monthlyData[row.month] = { income: 0, expenses: 0 };
      }
      if (row.type === 'income') {
        monthlyData[row.month].income = row.total;
      } else {
        monthlyData[row.month].expenses = row.total;
      }
    });

    const months = Object.keys(monthlyData).sort();
    const result = [];

    for (let i = 0; i < months.length; i++) {
      const month = months[i];
      const current = monthlyData[month];
      const previous = i > 0 ? monthlyData[months[i - 1]] : null;

      result.push({
        month,
        income: current.income,
        expenses: current.expenses,
        net: current.income - current.expenses,
        incomeChange: previous ? ((current.income - previous.income) / (previous.income || 1)) * 100 : 0,
        expenseChange: previous ? ((current.expenses - previous.expenses) / (previous.expenses || 1)) * 100 : 0
      });
    }

    return result;
  }

  calculateSavingsRate(typeSummary) {
    const income = typeSummary.find(t => t.type === 'income')?.total || 0;
    const expenses = typeSummary.find(t => t.type === 'expense')?.total || 0;
    
    if (income === 0) return 0;
    return ((income - expenses) / income) * 100;
  }
}

module.exports = new DashboardService();
