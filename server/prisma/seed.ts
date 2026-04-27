import { prisma } from '../src/lib/prismaClient';

async function main() {
  console.log("Wiping existing product catalog...");
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.subOrder.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.user.deleteMany({}); // wipe test users

  console.log("Creating Official Zimclick Vendor...");
  
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@zimclick.com",
      name: "Zimclick Administrator",
      role: "admin"
    }
  });

  const officialVendor = await prisma.vendor.create({
    data: {
      userId: adminUser.id,
      storeName: "Zimclick Global Athletics",
      description: "Official distributor of world-class sporting equipment.",
      isActive: true,
    }
  });

  console.log("Seeding universal sports categories...");
  const categoryNames = [
    'Cricket', 'Tennis', 'Hockey', 'Swimming', 
    'Golf', 'Soccer', 'Rugby', 'Baseball', 
    'Boxing', 'Badminton', 'Handball', 'Volleyball', 
    'Netball', 'Basketball', 'Pool', 'Sports Accessories'
  ];

  const categoriesMap: Record<string, string> = {};
  for (const catName of categoryNames) {
    const cat = await prisma.category.create({
      data: { 
        name: catName,
        slug: catName.toLowerCase().replace(/ /g, '-')
      }
    });
    categoriesMap[catName] = cat.id;
  }

  // --- Products Data ---
  const seedData = [
    { cat: 'Cricket', name: 'Cricket Bat', brand: 'English willow', price: 65 },
    { cat: 'Cricket', name: 'Cricket Bat', brand: 'Kashmir willow', price: 165 },
    { cat: 'Cricket', name: 'Helmet', brand: 'Bas', price: 90 },
    { cat: 'Cricket', name: 'Helmet', brand: 'Zimbo', price: 80 },
    { cat: 'Cricket', name: 'Gloves', brand: 'Wicket keeper', price: 110 },
    { cat: 'Cricket', name: 'Gloves', brand: 'Catchers', price: 80 },
    { cat: 'Cricket', name: 'Cricket balls', brand: 'Jug balls', price: 30 },
    { cat: 'Cricket', name: 'Cricket balls', brand: 'Cricket balls (Standard)', price: 40 },
    { cat: 'Cricket', name: 'Pads', brand: 'Cricket pads', price: 90 },

    { cat: 'Tennis', name: 'Racket', brand: 'Willson for senior', price: 60 },
    { cat: 'Tennis', name: 'Racket', brand: 'Pro staff', price: 70 },
    { cat: 'Tennis', name: 'Racket', brand: 'Elite', price: 80 },
    { cat: 'Tennis', name: 'Racket', brand: 'Babolat', price: 70 },
    { cat: 'Tennis', name: 'Racket', brand: 'Junior size 19, 21, 23', price: 50 },
    { cat: 'Tennis', name: 'Bands', brand: 'Wristband', price: 15 },
    { cat: 'Tennis', name: 'Bands', brand: 'Headband', price: 10 },
    { cat: 'Tennis', name: 'Tennis balls', brand: 'Dunlop Pro', price: 20 },
    { cat: 'Tennis', name: 'Tennis balls', brand: 'Club', price: 25 },
    { cat: 'Tennis', name: 'Tennis balls', brand: 'ATP', price: 25 },
    { cat: 'Tennis', name: 'Tennis balls', brand: 'Wilson', price: 25 },

    { cat: 'Hockey', name: 'Hockey Stick', brand: 'Wooden stick', price: 70 },
    { cat: 'Hockey', name: 'Hockey shinpads', brand: 'Standard', price: 55 },

    { cat: 'Swimming', name: 'Swimming caps', brand: 'Standard', price: 10 },
    { cat: 'Swimming', name: 'Swimming goggles', brand: 'Standard', price: 10 },

    { cat: 'Golf', name: 'Golf Shoe', brand: 'Standard', price: 200 },
    { cat: 'Golf', name: 'Golf kit', brand: 'Gallaway', price: 1700 },
    { cat: 'Golf', name: 'Golf ball', brand: 'Standard', price: 5 },
    { cat: 'Golf', name: 'Golf gloves', brand: 'Standard', price: 40 },

    { cat: 'Soccer', name: 'Soccer gloves', brand: 'Adidas', price: 60 },
    { cat: 'Soccer', name: 'Soccer gloves', brand: 'Elite', price: 120 },
    { cat: 'Soccer', name: 'Soccer shinpads', brand: 'Standard', price: 18 },
    { cat: 'Soccer', name: 'Soccer Jersey', brand: 'Standard', price: 25 },
    { cat: 'Soccer', name: 'Soccer balls hard ground', brand: 'Maita', price: 30 },
    { cat: 'Soccer', name: 'Soccer balls hard ground', brand: 'Tiro', price: 30 },
    { cat: 'Soccer', name: 'Soccer balls hard ground', brand: 'Tango', price: 30 },
    { cat: 'Soccer', name: 'Soccer balls hard ground', brand: 'Umbro', price: 30 },
    { cat: 'Soccer', name: 'Soccer speed balls', brand: 'Champions League', price: 120 },
    { cat: 'Soccer', name: 'Soccer speed balls', brand: 'Telstar', price: 120 },
    { cat: 'Soccer', name: 'Soccer speed balls', brand: 'Lotto', price: 90 },
    { cat: 'Soccer', name: 'Soccer speed balls', brand: 'Alhim', price: 120 },
    { cat: 'Soccer', name: 'Soccer Boots', brand: 'Nike Phatom', price: 130 },
    { cat: 'Soccer', name: 'Soccer Boots', brand: 'Adidas F50', price: 120 },
    { cat: 'Soccer', name: 'Soccer Boots', brand: 'Puma Future', price: 150 },
    { cat: 'Soccer', name: 'Soccer Boots', brand: 'Predator', price: 150 }
  ];

  console.log(`Seeding ${seedData.length} active inventory units...`);
  
  for (const item of seedData) {
    if (!categoriesMap[item.cat]) continue;
    await prisma.product.create({
      data: {
        vendorId: officialVendor.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        description: `Official ${item.brand} ${item.name} built for the highest tier of ${item.cat} competition.`,
        stock: 999,
        categories: {
          connect: [{ id: categoriesMap[item.cat] }]
        }
      }
    });
  }

  console.log("Database seeded successfully! Your storefront is now stocked!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
