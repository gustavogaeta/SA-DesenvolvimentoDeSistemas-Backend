const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// GET /api/dashboard — visão geral completa
router.get('/', dashboardController.getSummary);

// GET /api/dashboard/period?startDate=&endDate= — resumo por período
router.get('/period', dashboardController.getPeriodSummary);

module.exports = router;
