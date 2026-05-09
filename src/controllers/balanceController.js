const balanceService = require('../services/balanceService');

class BalanceController {
  async getBalance(req, res) {
    try {
      const userId = req.user.id;
      const result = await balanceService.calculateBalance(userId);
      res.status(200).json({
        success: true,
        message: 'Balance calculated successfully',
        data: result
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}

module.exports = new BalanceController();
