const db = require('../../config/database');

class UserRepository {
  async findById(id) {
    return db.get('SELECT * FROM users WHERE id = ?', [id]);
  }

  async findByEmail(email) {
    return db.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  async findAll(filters = {}) {
    let query = 'SELECT id, email, name, role, status, created_at, updated_at FROM users WHERE 1=1';
    const params = [];

    if (filters.role) {
      query += ' AND role = ?';
      params.push(filters.role);
    }

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters.search) {
      query += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const countQuery = query.replace('SELECT id, email, name, role, status, created_at, updated_at', 'SELECT COUNT(*) as total');
    const countResult = await db.get(countQuery, params);

    query += ' ORDER BY created_at DESC';

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
      
      if (filters.offset) {
        query += ' OFFSET ?';
        params.push(filters.offset);
      }
    }

    const users = await db.all(query, params);
    
    return {
      users,
      total: countResult.total
    };
  }

  async create(userData) {
    const result = await db.run(
      `INSERT INTO users (email, password_hash, name, role, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [userData.email, userData.password_hash, userData.name, userData.role, userData.status]
    );
    
    return this.findById(result.lastID);
  }

  async update(id, updates) {
    const fields = [];
    const params = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      params.push(updates.name);
    }
    if (updates.role !== undefined) {
      fields.push('role = ?');
      params.push(updates.role);
    }
    if (updates.status !== undefined) {
      fields.push('status = ?');
      params.push(updates.status);
    }
    if (updates.password_hash !== undefined) {
      fields.push('password_hash = ?');
      params.push(updates.password_hash);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    await db.run(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    return this.findById(id);
  }

  async delete(id) {
    const result = await db.run('DELETE FROM users WHERE id = ?', [id]);
    return result.changes > 0;
  }
}

module.exports = new UserRepository();
