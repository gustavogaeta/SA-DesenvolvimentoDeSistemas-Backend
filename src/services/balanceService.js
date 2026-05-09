const prisma = require('../models');

class BalanceService {
  async calculateBalance(userId) {
    // Buscar todas as transações não deletadas do usuário
    const transactions = await prisma.transaction.findMany({
      where: {
        createdBy: userId,
        deletedAt: null
      },
      select: {
        amount: true,
        type: true
      }
    });

    // Calcular totais
    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = income - expense;

    return {
      income,
      expense,
      balance,
      transactionCount: transactions.length
    };
  }
}

module.exports = new BalanceService();
