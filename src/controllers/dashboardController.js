const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');

class DashboardController {
  /**
   * GET /api/dashboard
   * Retorna visão geral: totais, evolução mensal, distribuição, transações recentes.
   */
  getSummary = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await dashboardService.getSummary(userId);
    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: result,
    });
  });

  /**
   * GET /api/dashboard/period?startDate=&endDate=
   * Retorna resumo financeiro filtrável por período.
   */
  getPeriodSummary = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;
    const result = await dashboardService.getPeriodSummary(userId, startDate, endDate);
    res.status(200).json({
      success: true,
      message: 'Period summary retrieved successfully',
      data: result,
    });
  });
}

module.exports = new DashboardController();
