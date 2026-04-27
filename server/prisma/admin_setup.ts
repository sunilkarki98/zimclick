import { prisma } from '../src/lib/prismaClient';

async function main() {
  const adminEmail = "suneelkarkee98@gmail.com";
  
  console.log(`Checking for existing user with email: ${adminEmail}`);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'admin',
    },
    create: {
      email: adminEmail,
      name: "Suneel Karkee",
      role: 'admin',
    }
  });

  console.log(`Success! ${user.email} is now a master Admin.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
