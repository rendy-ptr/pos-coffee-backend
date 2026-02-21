import { prisma } from '@/utils/prisma';
import type { Table, Prisma } from '@prisma/client';

export class TableRepository {
  async getAll(): Promise<Table[]> {
    return prisma.table.findMany({
      orderBy: { createdAt: 'desc' },
    }) as Promise<Table[]>;
  }

  async findById(id: string): Promise<Table | null> {
    return prisma.table.findUnique({
      where: { id },
    });
  }

  async findByNumber(number: number): Promise<Table | null> {
    return prisma.table.findUnique({
      where: { number },
    });
  }

  async create(data: Prisma.TableCreateInput): Promise<Table> {
    return prisma.table.create({
      data,
    }) as Promise<Table>;
  }

  async update(id: string, data: Prisma.TableUpdateInput): Promise<Table> {
    return prisma.table.update({
      where: { id },
      data,
    }) as Promise<Table>;
  }

  async delete(id: string): Promise<Table> {
    return prisma.table.delete({
      where: { id },
    });
  }
}

export const tableRepository = new TableRepository();
