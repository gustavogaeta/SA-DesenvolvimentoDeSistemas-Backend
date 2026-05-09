const transactionService = require('../services/transactionService');

class TransactionController {
  async getAll(req, res) {
    try {
      const userId = req.user.id;
      const result = await transactionService.getAll(userId);
      res.status(200).json({
        success: true,
        message: 'Transactions retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const result = await transactionService.getById(id, userId);
      res.status(200).json({
        success: true,
        message: 'Transaction retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async create(req, res) {
    try {
      const userId = req.user.id;
      const result = await transactionService.create(req.body, userId);
      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: result
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const result = await transactionService.update(id, req.body, userId);
      res.status(200).json({
        success: true,
        message: 'Transaction updated successfully',
        data: result
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await transactionService.delete(id, userId);
      res.status(200).json({
        success: true,
        message: 'Transaction deleted successfully'
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

module.exports = new TransactionController();
