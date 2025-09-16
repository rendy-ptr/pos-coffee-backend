import { prisma } from '@/utils/prisma';
import { baseLogger } from '@/middlewares/logger';
import { TableStatus, TableLocation } from '@prisma/client';

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (!admin) {
    baseLogger.error(
      'Admin user tidak ditemukan. Buat dulu user admin sebelum seed tables.'
    );
    throw new Error(
      'Admin user tidak ditemukan. Buat dulu user admin sebelum seed tables.'
    );
  }

  const TABLE_MOCK: Array<{
    number: number;
    capacity: number;
    location: TableLocation;
    status?: TableStatus;
    reservedBy?: string;
    reservedTime?: Date;
  }> = [
    { number: 1, capacity: 2, location: TableLocation.INDOOR },
    { number: 2, capacity: 4, location: TableLocation.INDOOR },
    { number: 3, capacity: 6, location: TableLocation.INDOOR },
    { number: 4, capacity: 2, location: TableLocation.OUTDOOR },
    { number: 5, capacity: 4, location: TableLocation.OUTDOOR },
    { number: 6, capacity: 8, location: TableLocation.OUTDOOR },
    {
      number: 7,
      capacity: 4,
      location: TableLocation.INDOOR,
      status: TableStatus.RESERVED,
      reservedBy: 'Andi Wijaya',
      reservedTime: new Date(Date.now() + 60 * 60 * 1000),
    },
  ];

  for (const table of TABLE_MOCK) {
    const existingTable = await prisma.table.findUnique({
      where: { number: table.number },
    });

    if (existingTable) {
      console.log(`⚠️ Meja nomor ${table.number} sudah ada, lewati.`);
      continue;
    }

    await prisma.table.create({
      data: {
        number: table.number,
        capacity: table.capacity,
        location: table.location,
        createdById: admin.id,
        status: table.status ?? undefined,
        reservedBy: table.reservedBy ?? undefined,
        reservedTime: table.reservedTime ?? undefined,
      },
    });

    console.log(`✅ Meja nomor ${table.number} berhasil dibuat.`);
  }

  console.log('✅ Seeder table selesai!');
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
