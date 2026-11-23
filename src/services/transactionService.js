const prisma = require('../models');
const Joi = require('joi');
const AppError = require('../utils/AppError');

class TransactionService {
  /**
   * Lista transações do usuário com suporte a filtros, paginação e busca.
   * @param {string} userId
   * @param {object} filters - { page, limit, type, search, startDate, endDate }
   */
  async getAll(userId, filters = {}) {
    const {
      page = 1,
      limit = 10,
      type,
      search,
      startDate,
      endDate,
    } = filters;

    // Montar cláusula where
    const where = { createdBy: userId, deletedAt: null };

    if (type && ['INCOME', 'EXPENSE'].includes(type.toUpperCase())) {
      where.type = type.toUpperCase();
    }

    if (search && search.trim()) {
      where.title = { contains: search.trim(), mode: 'insensitive' };
    }

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
      // Se nenhuma data válida foi adicionada, remove o campo
      if (Object.keys(where.createdAt).length === 0) delete where.createdAt;
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [total, transactions] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        select: {
          id: true,
          title: true,
          amount: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return {
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    };
  }

  async getById(id, userId) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, createdBy: userId, deletedAt: null },
      select: {
        id: true,
        title: true,
        amount: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!transaction) throw new AppError('Transaction not found', 404);
    return transaction;
  }

  async create(transactionData, userId) {
    const schema = Joi.object({
      title: Joi.string().min(1).max(255).required(),
      amount: Joi.number().positive().required(),
      type: Joi.string().valid('INCOME', 'EXPENSE').required(),
    });

    const { error } = schema.validate(transactionData);
    if (error) throw new AppError(error.details[0].message, 400);

    return prisma.transaction.create({
      data: {
        title: transactionData.title,
        amount: transactionData.amount,
        type: transactionData.type,
        createdBy: userId,
      },
      select: {
        id: true,
        title: true,
        amount: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id, transactionData, userId) {
    await this.getById(id, userId); // garante ownership

    const schema = Joi.object({
      title: Joi.string().min(1).max(255),
      amount: Joi.number().positive(),
      type: Joi.string().valid('INCOME', 'EXPENSE'),
    }).min(1); // pelo menos um campo

    const { error } = schema.validate(transactionData);
    if (error) throw new AppError(error.details[0].message, 400);

    return prisma.transaction.update({
      where: { id },
      data: transactionData,
      select: {
        id: true,
        title: true,
        amount: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id, userId) {
    await this.getById(id, userId); // garante ownership

    // Soft delete
    await prisma.transaction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

module.exports = new TransactionService();
