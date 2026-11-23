const balanceService = require('../services/balanceService');
const asyncHandler = require('../utils/asyncHandler');

class BalanceController {
  getBalance = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await balanceService.calculateBalance(userId);
    res.status(200).json({
      success: true,
      message: 'Balance calculated successfully',
      data: result,
    });
  });
}

module.exports = new BalanceController();
