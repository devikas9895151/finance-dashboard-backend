const db = require('../../config/database');

class RecordRepository {
  async findById(id) {
    return db.get('SELECT * FROM financial_records WHERE id = ?', [id]);
  }

  async findAll(filters = {}) {
    let query = 'SELECT * FROM financial_records WHERE 1=1';
    const params = [];

    if (filters.userId) {
      query += ' AND user_id = ?';
      params.push(filters.userId);
    }

    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.startDate) {
      query += ' AND date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND date <= ?';
      params.push(filters.endDate);
    }

    if (filters.minAmount) {
      query += ' AND amount >= ?';
      params.push(filters.minAmount);
    }

    if (filters.maxAmount) {
      query += ' AND amount <= ?';
      params.push(filters.maxAmount);
    }

    if (filters.search) {
      query += ' AND description LIKE ?';
      params.push(`%${filters.search}%`);
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await db.get(countQuery, params);

    query += ` ORDER BY ${filters.sortBy || 'date'} ${filters.sortOrder || 'DESC'}`;

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }
    }

    const records = await db.all(query, params);
    
    return {
      records,
      total: countResult.total
    };
  }

  async create(recordData) {
    const result = await db.run(
      `INSERT INTO financial_records (user_id, amount, type, category, date, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        recordData.user_id,
        recordData.amount,
        recordData.type,
        recordData.category,
        recordData.date,
        recordData.description
      ]
    );
    
    return this.findById(result.lastID);
  }

  async update(id, updates) {
    const fields = [];
    const params = [];

    if (updates.amount !== undefined) {
      fields.push('amount = ?');
      params.push(updates.amount);
    }
    if (updates.type !== undefined) {
      fields.push('type = ?');
      params.push(updates.type);
    }
    if (updates.category !== undefined) {
      fields.push('category = ?');
      params.push(updates.category);
    }
    if (updates.date !== undefined) {
      fields.push('date = ?');
      params.push(updates.date);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      params.push(updates.description);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await db.run(
      `UPDATE financial_records SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    return this.findById(id);
  }

  async delete(id) {
    const result = await db.run('DELETE FROM financial_records WHERE id = ?', [id]);
    return result.changes > 0;
  }

  async getSummary(filters = {}) {
    let whereClause = '1=1';
    const params = [];

    if (filters.userId) {
      whereClause += ' AND user_id = ?';
      params.push(filters.userId);
    }

    if (filters.startDate) {
      whereClause += ' AND date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      whereClause += ' AND date <= ?';
      params.push(filters.endDate);
    }

    const summaryQuery = `
      SELECT 
        type,
        SUM(amount) as total,
        COUNT(*) as count,
        AVG(amount) as average
      FROM financial_records
      WHERE ${whereClause}
      GROUP BY type
    `;

    const categoryQuery = `
      SELECT 
        category,
        type,
        SUM(amount) as total,
        COUNT(*) as count
      FROM financial_records
      WHERE ${whereClause}
      GROUP BY category, type
      ORDER BY total DESC
    `;

    const [typeSummary, categorySummary] = await Promise.all([
      db.all(summaryQuery, params),
      db.all(categoryQuery, params)
    ]);

    return { typeSummary, categorySummary };
  }

  async getRecentRecords(userId, limit = 10) {
    return db.all(
      `SELECT * FROM financial_records 
       WHERE user_id = ? 
       ORDER BY date DESC, created_at DESC 
       LIMIT ?`,
      [userId, limit]
    );
  }

  async getMonthlyTrends(filters = {}) {
    let whereClause = '1=1';
    const params = [];

    if (filters.userId) {
      whereClause += ' AND user_id = ?';
      params.push(filters.userId);
    }

    if (filters.startDate) {
      whereClause += ' AND date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      whereClause += ' AND date <= ?';
      params.push(filters.endDate);
    }

    return db.all(
      `SELECT 
        strftime('%Y-%m', date) as month,
        type,
        SUM(amount) as total,
        COUNT(*) as count
       FROM financial_records
       WHERE ${whereClause}
       GROUP BY month, type
       ORDER BY month DESC`,
      params
    );
  }
}

module.exports = new RecordRepository();
