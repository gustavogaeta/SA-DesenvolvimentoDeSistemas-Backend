const prisma = require('../models');
const Joi = require('joi');

class TransactionService {
  async getAll(userId) {
    const transactions = await prisma.transaction.findMany({
      where: {
        createdBy: userId,
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        amount: true,
        type: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return transactions;
  }

  async getById(id, userId) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        createdBy: userId,
        deletedAt: null
      },
      select: {
        id: true,
        title: true,
        amount: true,
        type: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!transaction) {
      const err = new Error('Transaction not found');
      err.status = 404;
      throw err;
    }

    return transaction;
  }

  async create(transactionData, userId) {
    // Validação dos dados
    const schema = Joi.object({
      title: Joi.string().min(1).max(255).required(),
      amount: Joi.number().positive().required(),
      type: Joi.string().valid('INCOME', 'EXPENSE').required()
    });

    const { error } = schema.validate(transactionData);
    if (error) {
      const err = new Error(error.details[0].message);
      err.status = 400;
      throw err;
    }

    const transaction = await prisma.transaction.create({
      data: {
        title: transactionData.title,
        amount: transactionData.amount,
        type: transactionData.type,
        createdBy: userId
      },
      select: {
        id: true,
        title: true,
        amount: true,
        type: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return transaction;
  }

  async update(id, transactionData, userId) {
    // Verificar se transação existe e pertence ao usuário
    const existingTransaction = await this.getById(id, userId);

    // Validação dos dados
    const schema = Joi.object({
      title: Joi.string().min(1).max(255),
      amount: Joi.number().positive(),
      type: Joi.string().valid('INCOME', 'EXPENSE')
    });

    const { error } = schema.validate(transactionData);
    if (error) {
      const err = new Error(error.details[0].message);
      err.status = 400;
      throw err;
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: transactionData,
      select: {
        id: true,
        title: true,
        amount: true,
        type: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return transaction;
  }

  async delete(id, userId) {
    // Verificar se transação existe e pertence ao usuário
    await this.getById(id, userId);

    // Soft delete
    await prisma.transaction.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}

module.exports = new TransactionService();
