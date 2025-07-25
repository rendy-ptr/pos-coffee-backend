import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/hash';

const prisma = new PrismaClient();

async function main() {
  await prisma.customerProfile.deleteMany();
  await prisma.adminProfile.deleteMany();
  await prisma.kasirProfile.deleteMany();
  await prisma.user.deleteMany();

  const adminUser = await prisma.user.create({
    data: {
      name: 'Pengguna Admin',
      email: 'admin@example.com',
      password: await hashPassword('admin123'),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      adminProfile: {
        create: {
          permissions: {
            canManageUsers: true,
            canManageInventory: true,
            canViewReports: true,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  const cashierUser = await prisma.user.create({
    data: {
      name: 'Pengguna Kasir',
      email: 'kasir@example.com',
      password: await hashPassword('kasir123'),
      role: 'kasir',
      createdAt: new Date(),
      updatedAt: new Date(),
      kasirProfile: {
        create: {
          shift: 'Pagi',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: 'Pengguna Customer',
      email: 'customer@example.com',
      password: await hashPassword('customer123'),
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
      customerProfile: {
        create: {
          loyaltyPoints: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  console.log('Data pengguna yang dibuat:', {
    adminUser,
    cashierUser,
    customerUser,
  });
}

main()
  .catch(e => {
    console.error('Error saat seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
