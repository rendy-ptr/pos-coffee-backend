import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!admin) {
    throw new Error(
      'Tidak ada user dengan role ADMIN. Buat dulu user admin sebelum seeding category.'
    );
  }

  const categories = [
    {
      name: 'Minuman',
      description: 'Aneka minuman hangat & dingin',
      icon: 'Coffee',
      createdById: admin.id,
    },
    {
      name: 'Makanan',
      description: 'Menu makanan utama',
      icon: 'Utensils',
      createdById: admin.id,
    },
    {
      name: 'Snack',
      description: 'Cemilan ringan untuk teman ngopi',
      icon: 'Popcorn',
      createdById: admin.id,
    },
    {
      name: 'Dessert',
      description: 'Makanan penutup manis',
      icon: 'IceCreamBowl',
      createdById: admin.id,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Category seeding selesai');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
