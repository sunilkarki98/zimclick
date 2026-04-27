import { prisma } from './src/lib/prismaClient';

async function check() {
  const count = await prisma.product.count();
  console.log(`Products in DB: ${count}`);
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
