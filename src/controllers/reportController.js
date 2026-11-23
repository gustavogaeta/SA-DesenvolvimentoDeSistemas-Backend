const reportService = require('../services/reportService');
const asyncHandler = require('../utils/asyncHandler');

class ReportController {
  /**
   * GET /api/reports/monthly?months=12
   * Relatório mensal agrupado.
   */
  getMonthly = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { months } = req.query;
    const result = await reportService.getMonthlyReport(userId, months);
    res.status(200).json({
      success: true,
      message: 'Monthly report retrieved successfully',
      data: result,
    });
  });

  /**
   * GET /api/reports/history?page=&limit=&startDate=&endDate=&type=
   * Histórico paginado com totais do período.
   */
  getHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page, limit, startDate, endDate, type } = req.query;
    const result = await reportService.getHistory(userId, {
      page,
      limit,
      startDate,
      endDate,
      type,
    });
    res.status(200).json({
      success: true,
      message: 'Transaction history retrieved successfully',
      data: result.data,
      pagination: result.pagination,
      periodTotals: result.periodTotals,
    });
  });
}

module.exports = new ReportController();
