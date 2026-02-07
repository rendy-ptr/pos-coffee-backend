import { prisma } from '@/utils/prisma';
import type { Category, Prisma } from '@prisma/client';

export class CategoryRepository {
  async getAll(
    orderBy: Prisma.CategoryOrderByWithRelationInput = { createdAt: 'desc' }
  ): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy,
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { name },
    });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({
      data,
    });
  }

  async update(
    id: string,
    data: Prisma.CategoryUpdateInput
  ): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }

  async countMenusByCategory(categoryId: string): Promise<number> {
    return prisma.menu.count({
      where: { categoryId },
    });
  }
}

export const categoryRepository = new CategoryRepository();
