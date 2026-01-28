import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function generateMemberId() {
  const year = new Date().getFullYear().toString().slice(-2);
  let randomNum = Math.floor(Math.random() * 10).toString();
  let memberId = `AK-${year}${randomNum}`;

  let exists = await prisma.customerProfile.findUnique({
    where: { member_id: memberId },
  });

  while (exists) {
    const extraDigit = Math.floor(Math.random() * 10).toString();
    memberId += extraDigit;

    exists = await prisma.customerProfile.findUnique({
      where: { member_id: memberId },
    });
  }

  return memberId;
}
