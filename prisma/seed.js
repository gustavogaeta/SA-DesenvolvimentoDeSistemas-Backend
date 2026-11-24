const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Criar usuário administrador
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fintech.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@fintech.com',
      password: adminPassword,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Criar usuário de teste
  const userPassword = await bcrypt.hash('user123', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@fintech.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@fintech.com',
      password: userPassword,
    },
  });

  console.log('✅ Test user created:', testUser.email);

  // Seed idempotente: substitui as transações anteriores do usuário de teste
  await prisma.transaction.deleteMany({ where: { createdBy: testUser.id } });

  // Transações distribuídas nos últimos 6 meses para alimentar a evolução mensal
  const now = new Date();
  const transactions = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const at = (day) => new Date(month.getFullYear(), month.getMonth(), day, 12);

    transactions.push(
      { title: 'Salário Mensal', amount: 5000.00, type: 'INCOME', createdBy: testUser.id, createdAt: at(5) },
      { title: 'Aluguel', amount: 1500.00, type: 'EXPENSE', createdBy: testUser.id, createdAt: at(8) },
      { title: 'Supermercado', amount: 400.50, type: 'EXPENSE', createdBy: testUser.id, createdAt: at(12) },
      { title: 'Freelance Project', amount: 1200.00, type: 'INCOME', createdBy: testUser.id, createdAt: at(16) },
      { title: 'Contas de Luz e Água', amount: 200.00, type: 'EXPENSE', createdBy: testUser.id, createdAt: at(20) },
    );
  }

  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }

  console.log('✅ Sample transactions created');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
