const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      staffProfile: true,
      residentProfile: true
    },
    orderBy: { createdAt: 'desc' }
  });
  console.log(`Total users in DB: ${users.length}`);
  users.forEach((u) => {
    console.log(`- [${u.status}] ID: ${u.id} | ${u.name} | ${u.email} | Role: ${u.role}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
