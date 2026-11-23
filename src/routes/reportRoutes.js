const express = require('express');
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

// GET /api/reports/monthly?months=12
router.get('/monthly', reportController.getMonthly);

// GET /api/reports/history?page=&limit=&startDate=&endDate=&type=
router.get('/history', reportController.getHistory);

module.exports = router;
