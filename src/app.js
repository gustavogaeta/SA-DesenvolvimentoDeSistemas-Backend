const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
require('dotenv').config();

const app = express();

// ─── Segurança ────────────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: function (origin, callback) {
    if (process.env.NODE_ENV === 'development') {
      if (!origin || origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
        return callback(null, true);
      }
    }
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ];
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
};
app.use(cors(corsOptions));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ─── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Logging ──────────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ─── Documentação Swagger ─────────────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'FinTech Flow API',
  customCss: '.swagger-ui .topbar { display: none }',
}));

// Expõe o JSON da spec para consumo externo
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─── Rotas ────────────────────────────────────────────────────────────────────
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
});

// ─── Middleware Global de Erros ───────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';

  // Erro de validação Joi
  if (err.isJoi || err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: err.details ? err.details.map((d) => d.message).join(', ') : err.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Erros de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid token',
      timestamp: new Date().toISOString(),
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Token expired',
      timestamp: new Date().toISOString(),
    });
  }

  // Erros do Prisma
  if (err.code && err.code.startsWith('P')) {
    const prismaMessages = {
      P2002: 'A record with this value already exists',
      P2025: 'Record not found',
      P2003: 'Foreign key constraint failed',
    };
    return res.status(400).json({
      success: false,
      error: 'Database Error',
      message: prismaMessages[err.code] || 'Database operation failed',
      timestamp: new Date().toISOString(),
    });
  }

  // AppError (erros de negócio explícitos)
  if (err.name === 'AppError') {
    return res.status(err.status || 500).json({
      success: false,
      error: err.status < 500 ? 'Client Error' : 'Server Error',
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Erro de CORS
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'CORS policy violation',
      timestamp: new Date().toISOString(),
    });
  }

  // Erro genérico — nunca expor stack em produção
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: isDev ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString(),
    ...(isDev && { stack: err.stack }),
  });
});

module.exports = app;
