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

  // Transações distribuídas nos últimos 6 meses, com valores diferentes por mês
  const now = new Date();
  const salaries   = [4800.00, 5000.00, 5200.00, 5000.00, 5400.00, 5800.00];
  const freelance  = [ 600.00, 1200.00,  800.00, 1500.00, 1000.00, 1800.00];
  const supermarket= [ 380.50,  420.75,  350.20,  510.40,  460.90,  395.60];
  const utilities  = [ 180.00,  210.00,  195.00,  240.00,  205.00,  230.00];
  const transactions = [];
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const at = (day) => new Date(month.getFullYear(), month.getMonth(), day, 12);

    transactions.push(
      { title: 'Salário Mensal', amount: salaries[i], type: 'INCOME', createdBy: testUser.id, createdAt: at(5) },
      { title: 'Aluguel', amount: 1500.00, type: 'EXPENSE', createdBy: testUser.id, createdAt: at(8) },
      { title: 'Supermercado', amount: supermarket[i], type: 'EXPENSE', createdBy: testUser.id, createdAt: at(12) },
      { title: 'Freelance Project', amount: freelance[i], type: 'INCOME', createdBy: testUser.id, createdAt: at(16) },
      { title: 'Contas de Luz e Água', amount: utilities[i], type: 'EXPENSE', createdBy: testUser.id, createdAt: at(20) },
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
