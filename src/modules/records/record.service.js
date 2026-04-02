const recordRepository = require('./record.repository');
const recordPolicy = require('./record.policy');
const ApiError = require('../../utils/ApiError');

class RecordService {
  async getRecords(actor, filters) {
    const policyFilter = recordPolicy.getViewFilter(actor);
    
    const page = parseInt(filters.page) || 1;
    const limit = Math.min(parseInt(filters.limit) || 20, 100);
    const offset = (page - 1) * limit;

    const { records, total } = await recordRepository.findAll({
      ...filters,
      ...policyFilter,
      limit,
      offset
    });

    return {
      records: records.map(this.formatRecord),
      pagination: { page, limit, total }
    };
  }

  async getRecordById(actor, recordId) {
    const record = await recordRepository.findById(recordId);
    
    if (!record) {
      throw ApiError.notFound('Record not found');
    }

    recordPolicy.assertCanView(actor, record);

    return this.formatRecord(record);
  }

  async createRecord(actor, recordData) {
    recordPolicy.assertCanCreate(actor);

    const record = await recordRepository.create({
      user_id: actor.id,
      amount: recordData.amount,
      type: recordData.type,
      category: recordData.category,
      date: recordData.date,
      description: recordData.description
    });

    return this.formatRecord(record);
  }

  async updateRecord(actor, recordId, updates) {
    const record = await recordRepository.findById(recordId);
    
    if (!record) {
      throw ApiError.notFound('Record not found');
    }

    recordPolicy.assertCanUpdate(actor, record);

    const updatedRecord = await recordRepository.update(recordId, updates);

    return this.formatRecord(updatedRecord);
  }

  async deleteRecord(actor, recordId) {
    const record = await recordRepository.findById(recordId);
    
    if (!record) {
      throw ApiError.notFound('Record not found');
    }

    recordPolicy.assertCanDelete(actor, record);

    await recordRepository.delete(recordId);
    
    return { message: 'Record deleted successfully' };
  }

  formatRecord(record) {
    return {
      id: record.id,
      userId: record.user_id,
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date,
      description: record.description,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    };
  }
}

module.exports = new RecordService();
