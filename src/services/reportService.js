const prisma = require('../models');

class ReportService {
  /**
   * Resumo financeiro agrupado por mês.
   * Query param: months (padrão 12)
   */
  async getMonthlyReport(userId, months = 12) {
    const monthCount = Math.min(24, Math.max(1, parseInt(months) || 12));
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (monthCount - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        createdBy: userId,
        deletedAt: null,
        createdAt: { gte: startDate },
      },
      select: { amount: true, type: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const monthlyMap = {};
    transactions.forEach((t) => {
      const date = new Date(t.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: key, income: 0, expense: 0, balance: 0, count: 0 };
      }
      if (t.type === 'INCOME') {
        monthlyMap[key].income += Number(t.amount);
      } else {
        monthlyMap[key].expense += Number(t.amount);
      }
      monthlyMap[key].balance = monthlyMap[key].income - monthlyMap[key].expense;
      monthlyMap[key].count += 1;
    });

    const months_data = Object.values(monthlyMap).sort((a, b) =>
      a.month.localeCompare(b.month),
    );

    // Totais do período
    const totals = months_data.reduce(
      (acc, m) => ({
        income: acc.income + m.income,
        expense: acc.expense + m.expense,
        balance: acc.income + m.income - (acc.expense + m.expense),
        count: acc.count + m.count,
      }),
      { income: 0, expense: 0, balance: 0, count: 0 },
    );

    return { period: { months: monthCount, from: startDate.toISOString() }, totals, months: months_data };
  }

  /**
   * Histórico paginado de transações com totais do período.
   * Query params: page, limit, startDate, endDate, type
   */
  async getHistory(userId, filters = {}) {
    const { page = 1, limit = 20, startDate, endDate, type } = filters;

    const where = { createdBy: userId, deletedAt: null };

    if (type && ['INCOME', 'EXPENSE'].includes(type.toUpperCase())) {
      where.type = type.toUpperCase();
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        const s = new Date(startDate);
        if (!isNaN(s.getTime())) where.createdAt.gte = s;
      }
      if (endDate) {
        const e = new Date(endDate);
        if (!isNaN(e.getTime())) where.createdAt.lte = e;
      }
      if (Object.keys(where.createdAt).length === 0) delete where.createdAt;
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [total, transactions] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        select: { id: true, title: true, amount: true, type: true, createdAt: true },
      }),
    ]);

    // Totais do conjunto filtrado (sem paginação)
    const allFiltered = await prisma.transaction.findMany({
      where,
      select: { amount: true, type: true },
    });

    const periodIncome = allFiltered
      .filter((t) => t.type === 'INCOME')
      .reduce((s, t) => s + Number(t.amount), 0);
    const periodExpense = allFiltered
      .filter((t) => t.type === 'EXPENSE')
      .reduce((s, t) => s + Number(t.amount), 0);

    return {
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
      periodTotals: {
        income: periodIncome,
        expense: periodExpense,
        balance: periodIncome - periodExpense,
        count: total,
      },
    };
  }
}

module.exports = new ReportService();
