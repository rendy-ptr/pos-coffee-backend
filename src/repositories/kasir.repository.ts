import { prisma } from '@/utils/prisma';
import {
  KasirListResponse,
  kasirListSelect,
  KasirDetailResponse,
  kasirDetailSelect,
  kasirMutateSelect,
  kasirMutateResponse,
} from '@/queries/kasir.query';

import { Prisma, User, UserRole } from '@prisma/client';

export class KasirRepository {
  async getAll(): Promise<KasirListResponse[]> {
    return prisma.user.findMany({
      where: { role: UserRole.KASIR },
      orderBy: { createdAt: 'desc' },
      select: kasirListSelect,
    }) as Promise<KasirListResponse[]>;
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<kasirMutateResponse> {
    return prisma.user.create({
      data,
      select: kasirMutateSelect,
    }) as Promise<kasirMutateResponse>;
  }

  async update(
    id: string,
    data: Prisma.UserUpdateInput
  ): Promise<kasirMutateResponse> {
    return prisma.user.update({
      where: { id },
      data,
      select: kasirMutateSelect,
    }) as Promise<kasirMutateResponse>;
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async findKasirDetail(id: string): Promise<KasirDetailResponse | null> {
    return prisma.user.findUnique({
      where: { id },
      select: kasirDetailSelect,
    });
  }
}

export const kasirRepository = new KasirRepository();
