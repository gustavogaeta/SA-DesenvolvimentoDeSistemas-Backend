const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const PORT = process.env.PORT || 3333;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Inicialização do Prisma Client
const prisma = new PrismaClient({
  log: NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Teste de conexão com o banco de dados
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Graceful shutdown
async function gracefulShutdown(signal) {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
  
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error.message);
    process.exit(1);
  }
}

// Event listeners para graceful shutdown
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Tratamento de exceções não capturadas
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown('unhandledRejection');
});

// Inicialização do servidor
async function startServer() {
  try {
    // Testa conexão com o banco
    const dbConnected = await testDatabaseConnection();
    
    if (!dbConnected) {
      console.log('⚠️  Starting server without database connection...');
    }

    // Inicia o servidor HTTP
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 FinTech Flow Backend Server`);
      console.log(`📍 Environment: ${NODE_ENV}`);
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`⏰ Started at: ${new Date().toISOString()}\n`);
    });

    // Adiciona o Prisma client ao app para uso em outras partes
    app.set('prisma', prisma);

    // Timeout para requisições longas
    server.timeout = 30000; // 30 segundos

    return server;
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Inicia o servidor
startServer();
