const prisma = require('../models');

class DashboardService {
  /**
   * Retorna todos os dados necessários para o dashboard:
   * - Totais (income, expense, balance, transactionCount)
   * - Evolução mensal (últimos 6 meses)
   * - Distribuição por tipo
   */
  async getSummary(userId) {
    // 1. Totais gerais
    const transactions = await prisma.transaction.findMany({
      where: { createdBy: userId, deletedAt: null },
      select: { amount: true, type: true, createdAt: true },
    });

    const income = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = income - expense;
    const transactionCount = transactions.length;

    // 2. Evolução mensal (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentTransactions = transactions.filter(
      (t) => new Date(t.createdAt) >= sixMonthsAgo,
    );

    const monthlyMap = {};
    recentTransactions.forEach((t) => {
      const date = new Date(t.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: key, income: 0, expense: 0, balance: 0 };
      }
      if (t.type === 'INCOME') {
        monthlyMap[key].income += Number(t.amount);
      } else {
        monthlyMap[key].expense += Number(t.amount);
      }
      monthlyMap[key].balance = monthlyMap[key].income - monthlyMap[key].expense;
    });

    const monthlyEvolution = Object.values(monthlyMap).sort((a, b) =>
      a.month.localeCompare(b.month),
    );

    // 3. Últimas 5 transações
    const recentTransactionsDetail = await prisma.transaction.findMany({
      where: { createdBy: userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, amount: true, type: true, createdAt: true },
    });

    return {
      totals: { income, expense, balance, transactionCount },
      monthlyEvolution,
      distribution: { income, expense },
      recentTransactions: recentTransactionsDetail,
    };
  }

  /**
   * Retorna resumo financeiro filtrável por período.
   */
  async getPeriodSummary(userId, startDate, endDate) {
    const where = { createdBy: userId, deletedAt: null };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) where.createdAt.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) where.createdAt.lte = end;
      }
      if (Object.keys(where.createdAt).length === 0) delete where.createdAt;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      select: { amount: true, type: true },
    });

    const income = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: transactions.length,
      period: { startDate: startDate || null, endDate: endDate || null },
    };
  }
}

module.exports = new DashboardService();
