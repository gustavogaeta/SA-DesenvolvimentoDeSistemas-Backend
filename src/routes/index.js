const express = require('express');
const authRoutes = require('./authRoutes');
const transactionRoutes = require('./transactionRoutes');
const balanceRoutes = require('./balanceRoutes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/balance', balanceRoutes);

module.exports = router;
