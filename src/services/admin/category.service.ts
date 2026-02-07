import { categoryRepository } from '@/repositories/admin/category.repository';
import { NotFoundError, BusinessError } from '@/utils/errors';
import type { Category } from '@prisma/client';
import { baseLogger } from '@/middlewares/logger';
import {
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '@/schemas/category.schema';

export class CategoryService {
  private repository = categoryRepository;

  async getAllCategories(): Promise<Category[]> {
    return this.repository.getAll({ createdAt: 'desc' });
  }

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    const existingCategory = await this.repository.findByName(data.name);
    if (existingCategory) {
      throw new BusinessError('Kategori dengan nama tersebut sudah ada');
    }

    const category = await this.repository.create({
      name: data.name,
      description: data.description ?? '',
      isActive: data.isActive,
    });

    baseLogger.info(`Kategori dibuat: ${category.name}`);
    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category> {
    const existingCategory = await this.repository.findById(id);
    if (!existingCategory) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }

    if (data.name && data.name !== existingCategory.name) {
      const duplicateCategory = await this.repository.findByName(data.name);
      if (duplicateCategory) {
        throw new BusinessError('Kategori dengan nama tersebut sudah ada');
      }
    }

    const updatedCategory = await this.repository.update(id, data);

    baseLogger.info(`Kategori diperbarui: ${updatedCategory.name}`);
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<Category> {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }

    const menuCount = await this.repository.countMenusByCategory(id);
    if (menuCount > 0) {
      throw new BusinessError(
        'Kategori masih digunakan oleh menu, tidak bisa dihapus'
      );
    }

    await this.repository.delete(id);

    baseLogger.info(`Kategori dihapus: ${category.name}`);
    return category;
  }
}

export const categoryService = new CategoryService();
