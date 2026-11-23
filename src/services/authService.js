const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../models');
const Joi = require('joi');
const AppError = require('../utils/AppError');

class AuthService {
  async register(userData) {
    const schema = Joi.object({
      name: Joi.string().min(3).max(100).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(userData);
    if (error) throw new AppError(error.details[0].message, 400);

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existingUser) throw new AppError('User already exists', 409);

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    const token = this.generateToken(user.id);
    return { user, token };
  }

  async login(loginData) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(loginData);
    if (error) throw new AppError(error.details[0].message, 400);

    const user = await prisma.user.findUnique({
      where: { email: loginData.email },
    });
    if (!user) throw new AppError('Invalid credentials', 401);

    if (user.deletedAt) throw new AppError('User account is deactivated', 401);

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) throw new AppError('Invalid credentials', 401);

    const token = this.generateToken(user.id);
    return {
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      token,
    };
  }

  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }

  verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

module.exports = new AuthService();
