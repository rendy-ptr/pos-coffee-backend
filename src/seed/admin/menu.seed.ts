import { PrismaClient } from '@prisma/client';
import { MENU_MOCK } from '@/mocks/menu.mock';
import { baseLogger } from '@/middlewares/logger';

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!admin) {
    baseLogger.error(
      'Admin user tidak ditemukan. Buat dulu user admin sebelum seed menus.'
    );
    throw new Error(
      'Admin user tidak ditemukan. Buat dulu user admin sebelum seed menus.'
    );
  }

  for (const item of MENU_MOCK) {
    const category = await prisma.category.findUnique({
      where: { name: item.categoryName },
    });

    if (!category) {
      baseLogger.warn(
        `Kategori dengan nama ${item.categoryName} tidak ditemukan. Lewati menu ${item.name}.`
      );
      continue;
    }

    await prisma.menu.upsert({
      where: { name: item.name },
      update: {
        imageUrl: item.imageUrl,
        stock: item.stock,
        productionCapital: item.productionCapital,
        sellingPrice: item.sellingPrice,
        profit: item.profit,
        isActive: item.isActive,
      },
      create: {
        imageUrl: item.imageUrl,
        name: item.name,
        categoryId: category.id,
        stock: item.stock,
        productionCapital: item.productionCapital,
        sellingPrice: item.sellingPrice,
        profit: item.profit,
        isActive: item.isActive,
        createdById: admin.id,
      },
    });
  }

  console.log('✅ Seeder menus selesai!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
