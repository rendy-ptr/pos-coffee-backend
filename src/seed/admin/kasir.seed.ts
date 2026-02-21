import { prisma } from '@/utils/prisma';
import { CASHIER_MOCK } from '@/mocks/kasir.mock';
import { baseLogger } from '@/middlewares/logger';
import { hashPassword } from '@/utils/hash';

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

  for (const cashier of CASHIER_MOCK) {
    const existingCashier = await prisma.user.findUnique({
      where: { email: cashier.email },
    });

    if (existingCashier) {
      console.log(`⚠️ Kasir dengan email ${cashier.email} sudah ada, lewati.`);
      continue;
    }

    const plainPassword = 'password123';
    const hashedPassword = await hashPassword(plainPassword);

    await prisma.user.create({
      data: {
        name: cashier.name,
        email: cashier.email,
        password: hashedPassword,
        role: 'CASHIER',
        phone: cashier.phone,
        profilePicture: cashier.profilePicture,
        isActive: cashier.isActive,
        cashierProfile: {
          create: {
            shiftStart: cashier.shiftStart,
            shiftEnd: cashier.shiftEnd,
          },
        },
      },
    });

    console.log(`✅ Kasir ${cashier.name} berhasil dibuat.`);
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
