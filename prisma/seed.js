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

  // Criar transações de exemplo para o usuário de teste
  const transactions = [
    {
      title: 'Salário Mensal',
      amount: 5000.00,
      type: 'INCOME',
      createdBy: testUser.id,
    },
    {
      title: 'Aluguel',
      amount: 1500.00,
      type: 'EXPENSE',
      createdBy: testUser.id,
    },
    {
      title: 'Supermercado',
      amount: 400.50,
      type: 'EXPENSE',
      createdBy: testUser.id,
    },
    {
      title: 'Freelance Project',
      amount: 1200.00,
      type: 'INCOME',
      createdBy: testUser.id,
    },
    {
      title: 'Contas de Luz e Água',
      amount: 200.00,
      type: 'EXPENSE',
      createdBy: testUser.id,
    },
  ];

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
