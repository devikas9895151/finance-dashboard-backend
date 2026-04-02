class FinancialRecord {
  constructor(data) {
    this.id = data.id;
    this.userId = data.user_id;
    this.amount = data.amount;
    this.type = data.type;
    this.category = data.category;
    this.date = data.date;
    this.description = data.description;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      amount: this.amount,
      type: this.type,
      category: this.category,
      date: this.date,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = FinancialRecord;
