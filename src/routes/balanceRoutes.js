const express = require('express');
const balanceController = require('../controllers/balanceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Todas as rotas de saldo exigem autenticação
router.use(authMiddleware);

// Rota de saldo
router.get('/', balanceController.getBalance);

module.exports = router;
