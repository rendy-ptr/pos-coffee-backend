import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../utils/hash';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@mail.com' },
  });

  if (existingAdmin) {
    console.log('⚠️ Admin sudah ada, tidak membuat ulang.');
    console.log('👤 Admin ID:', existingAdmin.id);
    return;
  }

  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@admin.com',
      password: await hashPassword('password'),
      role: 'ADMIN',
      phone: '081234567890',
      isActive: true,
    },
  });

  // Buat admin profile
  await prisma.adminProfile.create({
    data: {
      userId: admin.id,
    },
  });

  console.log('✅ Admin created successfully!');
  console.log('📧 Email: admin@admin.com');
  console.log('🔑 Password: password');
  console.log('👤 Admin ID:', admin.id);
}

main()
  .catch(e => {
    console.error('Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
