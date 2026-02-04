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
      isActive: true,
    },
    {
      name: 'Makanan',
      description: 'Menu makanan utama',
      isActive: true,
    },
    {
      name: 'Snack',
      description: 'Cemilan ringan untuk teman ngopi',
      isActive: true,
    },
    {
      name: 'Dessert',
      description: 'Makanan penutup manis',
      isActive: true,
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      create: category,
      where: { name: category.name },
      update: {},
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
