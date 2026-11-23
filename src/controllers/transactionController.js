const transactionService = require('../services/transactionService');
const asyncHandler = require('../utils/asyncHandler');

class TransactionController {
  getAll = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page, limit, type, search, startDate, endDate } = req.query;
    const result = await transactionService.getAll(userId, {
      page,
      limit,
      type,
      search,
      startDate,
      endDate,
    });
    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await transactionService.getById(id, userId);
    res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: result,
    });
  });

  create = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await transactionService.create(req.body, userId);
    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: result,
    });
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const result = await transactionService.update(id, req.body, userId);
    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: result,
    });
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    await transactionService.delete(id, userId);
    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  });
}

module.exports = new TransactionController();
