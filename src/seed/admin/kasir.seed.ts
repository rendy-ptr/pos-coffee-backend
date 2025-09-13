import { prisma } from '@/utils/prisma';
import { hashPassword } from '@/utils/hash';
import { KASIR_MOCK } from '@/mocks/kasir.mock';
import { baseLogger } from '@/middlewares/logger';

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

  for (const kasir of KASIR_MOCK) {
    const existingKasir = await prisma.user.findUnique({
      where: { email: kasir.email },
    });

    if (existingKasir) {
      console.log(`⚠️ Kasir dengan email ${kasir.email} sudah ada, lewati.`);
      continue;
    }

    const hashedPassword = await hashPassword(kasir.password);

    await prisma.user.create({
      data: {
        name: kasir.name,
        email: kasir.email,
        password: hashedPassword,
        role: 'KASIR',
        phone: kasir.phone,
        isActive: kasir.isActive,
        kasirProfile: {
          create: {
            shiftStart: kasir.shiftStart,
            shiftEnd: kasir.shiftEnd,
          },
        },
      },
    });

    console.log(`✅ Kasir ${kasir.name} berhasil dibuat.`);
  }

  console.log('✅ Seeder kasir selesai!');
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
