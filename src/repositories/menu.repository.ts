import { prisma } from '@/utils/prisma';
import type { Menu, Prisma } from '@prisma/client';
import { MenuWithCategory } from '@/data/menu.data';

export class MenuRepository {
  async findAll(): Promise<MenuWithCategory[]> {
    return prisma.menu.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    }) as Promise<MenuWithCategory[]>;
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

  async create(data: Prisma.MenuCreateInput): Promise<Menu> {
    return prisma.menu.create({
      data,
    });
  }

  async update(id: string, data: Prisma.MenuUpdateInput): Promise<Menu> {
    return prisma.menu.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Menu> {
    return prisma.menu.delete({
      where: { id },
    });
  }
}

export const menuRepository = new MenuRepository();
