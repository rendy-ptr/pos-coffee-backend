import { prisma } from '@/utils/prisma';
import { generateMemberId } from '@/utils/generateMemberId';
import type { User, Prisma } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id, isActive: true },
    });
  }

  async createWithCustomer(userData: Prisma.UserCreateInput): Promise<User> {
    return prisma.$transaction(async tx => {
      const user = await tx.user.create({
        data: userData,
      });

      await tx.customerProfile.create({
        data: {
          userId: user.id,
          loyaltyPoints: 10,
          member_id: await generateMemberId(),
        },
      });

      return user;
    });
  }
}

export const userRepository = new UserRepository();
