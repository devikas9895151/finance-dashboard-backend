const recordService = require('./record.service');
const ApiResponse = require('../../utils/ApiResponse');

class RecordController {
  async getRecords(req, res, next) {
    try {
      const { records, pagination } = await recordService.getRecords(req.user, req.query);
      ApiResponse.paginated(res, records, pagination);
    } catch (error) {
      next(error);
    }
  }

  async getRecordById(req, res, next) {
    try {
      const record = await recordService.getRecordById(req.user, parseInt(req.params.id));
      ApiResponse.success(res, record);
    } catch (error) {
      next(error);
    }
  }

  async createRecord(req, res, next) {
    try {
      const record = await recordService.createRecord(req.user, req.body);
      ApiResponse.created(res, record, 'Record created successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateRecord(req, res, next) {
    try {
      const record = await recordService.updateRecord(
        req.user,
        parseInt(req.params.id),
        req.body
      );
      ApiResponse.success(res, record, 'Record updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteRecord(req, res, next) {
    try {
      await recordService.deleteRecord(req.user, parseInt(req.params.id));
      ApiResponse.noContent(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecordController();
