import { prisma } from '@/utils/prisma';
import type { User } from '@prisma/client';

export class LoginRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}

export const loginRepository = new LoginRepository();
