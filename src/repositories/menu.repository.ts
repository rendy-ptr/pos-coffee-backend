import { prisma } from '@/utils/prisma';
import type { Menu, Prisma } from '@prisma/client';
import {
  menuDetailResponse,
  menuListResponse,
  menuListSelect,
  menuMutateResponse,
  menuMutateSelect,
} from '@/queries/menu.query';

export class MenuRepository {
  async findAll(): Promise<menuListResponse[]> {
    return prisma.menu.findMany({
      orderBy: { createdAt: 'desc' },
      select: menuListSelect,
    }) as Promise<menuListResponse[]>;
  }

  async findById(id: string): Promise<Menu | null> {
    return prisma.menu.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Menu | null> {
    return prisma.menu.findUnique({
      where: { name },
    });
  }

  async create(data: Prisma.MenuCreateInput): Promise<menuMutateResponse> {
    return prisma.menu.create({
      data,
      select: menuMutateSelect,
    }) as Promise<menuMutateResponse>;
  }

  async update(
    id: string,
    data: Prisma.MenuUpdateInput
  ): Promise<menuMutateResponse> {
    return prisma.menu.update({
      where: { id },
      data,
      select: menuMutateSelect,
    }) as Promise<menuMutateResponse>;
  }

  async delete(id: string): Promise<Menu> {
    return prisma.menu.delete({
      where: { id },
    });
  }

  async findMenuDetail(id: string): Promise<menuDetailResponse | null> {
    return prisma.menu.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
  }
}

export const menuRepository = new MenuRepository();
