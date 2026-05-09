const authService = require('../services/authService');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const err = new Error('Authorization header is required');
      err.status = 401;
      throw err;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      const err = new Error('Invalid authorization header format');
      err.status = 401;
      throw err;
    }

    const token = parts[1];

    if (!token) {
      const err = new Error('Token is required');
      err.status = 401;
      throw err;
    }

    const decoded = authService.verifyToken(token);
    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

module.exports = authMiddleware;
