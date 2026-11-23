const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result,
    });
  });

  login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });
}

module.exports = new AuthController();
