import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedVouchers() {
  try {
    const vouchers = [
      {
        code: 'WELCOME10',
        discount: 10.0,
        expiresAt: new Date('2025-12-31T23:59:59Z'),
        minPurchase: 50.0,
        isOnlyForNewUser: true,
        terms: 'Valid for first purchase only, minimum purchase $50',
      },
      {
        code: 'SAVE20',
        discount: 20.0,
        expiresAt: new Date('2025-12-31T23:59:59Z'),
        minPurchase: 100.0,
        isOnlyForNewUser: false,
        terms: 'Valid for all customers, minimum purchase $100',
      },
      {
        code: 'NEWUSER15',
        discount: 15.0,
        expiresAt: new Date('2025-12-31T23:59:59Z'),
        minPurchase: 30.0,
        isOnlyForNewUser: true,
        terms: 'Valid for new customers only, minimum purchase $30',
      },
    ];

    for (const voucher of vouchers) {
      await prisma.voucher.create({
        data: voucher,
      });
      console.log(`Created voucher: ${voucher.code}`);
    }

    console.log('Voucher seeding completed successfully');
  } catch (error) {
    console.error('Error seeding vouchers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedVouchers();
