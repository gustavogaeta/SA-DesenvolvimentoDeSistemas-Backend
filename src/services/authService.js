const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../models');
const Joi = require('joi');

class AuthService {
  async register(userData) {
    // Validação dos dados
    const schema = Joi.object({
      name: Joi.string().min(3).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(userData);
    if (error) {
      const err = new Error(error.details[0].message);
      err.status = 400;
      throw err;
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      const err = new Error('User already exists');
      err.status = 409;
      throw err;
    }

    // Criptografar senha
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    // Gerar token JWT
    const token = this.generateToken(user.id);

    return {
      user,
      token
    };
  }

  async login(loginData) {
    // Validação dos dados
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });

    const { error } = schema.validate(loginData);
    if (error) {
      const err = new Error(error.details[0].message);
      err.status = 400;
      throw err;
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: loginData.email }
    });

    if (!user) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }

    // Verificar se usuário foi deletado
    if (user.deletedAt) {
      const err = new Error('User account is deactivated');
      err.status = 401;
      throw err;
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      const err = new Error('Invalid credentials');
      err.status = 401;
      throw err;
    }

    // Gerar token JWT
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    };
  }

  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = new AuthService();
