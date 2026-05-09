const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Middleware de segurança
app.use(helmet());

// Configuração CORS - Desenvolvimento permite qualquer porta local
const corsOptions = {
  origin: function (origin, callback) {
    // Em desenvolvimento, permite qualquer origem localhost/127.0.0.1
    if (process.env.NODE_ENV === 'development') {
      // Permite localhost e 127.0.0.1 em qualquer porta
      if (!origin || origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
        return callback(null, true);
      }
    }
    
    // Produção: usa origens específicas
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limite 100 requisições
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Parser de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Importar rotas
const apiRoutes = require('./routes');

// Rotas
app.use('/api', apiRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Erro de validação do Joi
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.details.map(detail => detail.message).join(', '),
      timestamp: new Date().toISOString()
    });
  }

  // Erro do Prisma
  if (err.code && err.code.startsWith('P')) {
    return res.status(400).json({
      error: 'Database Error',
      message: 'Database operation failed',
      timestamp: new Date().toISOString()
    });
  }

  // Erro genérico
  res.status(err.status || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
