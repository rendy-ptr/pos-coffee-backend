import { prisma } from '@/utils/prisma';
import {
  CashierListResponse,
  cashierListSelect,
  CashierDetailResponse,
  cashierDetailSelect,
  cashierMutateSelect,
  CashierMutateResponse,
} from '@/features/admin-role/cashier/queries/cashier.query';

import { Prisma, User, UserRole } from '@prisma/client';

export class CashierRepository {
  async getAll(): Promise<CashierListResponse[]> {
    return prisma.user.findMany({
      where: { role: UserRole.CASHIER },
      orderBy: { createdAt: 'desc' },
      select: cashierListSelect,
    }) as Promise<CashierListResponse[]>;
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

  async create(
    data: Prisma.UserCreateInput,
    tx: Prisma.TransactionClient
  ): Promise<CashierMutateResponse> {
    return tx.user.create({
      data,
      select: cashierMutateSelect,
    }) as Promise<CashierMutateResponse>;
  }

  async update(
    id: string,
    data: Prisma.UserUpdateInput
  ): Promise<CashierMutateResponse> {
    return prisma.user.update({
      where: { id },
      data,
      select: cashierMutateSelect,
    }) as Promise<CashierMutateResponse>;
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async findCashierDetail(id: string): Promise<CashierDetailResponse | null> {
    return prisma.user.findUnique({
      where: { id },
      select: cashierDetailSelect,
    });
  }
}

export const cashierRepository = new CashierRepository();
