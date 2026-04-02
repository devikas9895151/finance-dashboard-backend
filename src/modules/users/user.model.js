class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.password_hash;
    this.name = data.name;
    this.role = data.role;
    this.status = data.status;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromDatabase(row) {
    if (!row) return null;
    return new User(row);
  }
}

module.exports = User;
