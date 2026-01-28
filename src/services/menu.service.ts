import { menuRepository } from '@/repositories/menu.repository';
import { categoryRepository } from '@/repositories/category.repository';
import { BusinessError, NotFoundError } from '@/utils/errors';
import {
  CreateMenuDTO,
  UpdateMenuDTO,
  MenuWithCategory,
} from '@/data/menu.data';
import type { Menu, Prisma } from '@prisma/client';
import { baseLogger } from '@/middlewares/logger';

export class MenuService {
  private repository = menuRepository;

  async getAllMenus(): Promise<MenuWithCategory[]> {
    return this.repository.findAll();
  }

  async createMenu(userId: string, data: CreateMenuDTO): Promise<Menu> {
    const existingMenu = await this.repository.findByName(data.name);
    if (existingMenu) {
      throw new BusinessError('Menu dengan nama tersebut sudah ada');
    }

    const { categoryId, ...menuData } = data;

    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }

    const menu = await this.repository.create({
      ...menuData,
      category: {
        connect: { id: categoryId },
      },
      createdBy: {
        connect: { id: userId },
      },
    });

    baseLogger.info(`Menu dibuat: ${menu.name} oleh user ${userId}`);
    return menu;
  }

  async updateMenu(id: string, data: UpdateMenuDTO): Promise<Menu> {
    const existingMenu = await this.repository.findById(id);
    if (!existingMenu) {
      throw new NotFoundError('Menu tidak ditemukan');
    }

    if (data.name && data.name !== existingMenu.name) {
      const duplicateMenu = await this.repository.findByName(data.name);
      if (duplicateMenu) {
        throw new BusinessError('Menu dengan nama tersebut sudah ada');
      }
    }

    const { categoryId, ...updateData } = data;
    const finalUpdateData: Prisma.MenuUpdateInput = { ...updateData };

    if (categoryId) {
      const category = await categoryRepository.findById(categoryId);
      if (!category) {
        throw new NotFoundError('Kategori tidak ditemukan');
      }

      finalUpdateData.category = {
        connect: { id: categoryId },
      };
    }

    const updatedMenu = await this.repository.update(id, finalUpdateData);

    baseLogger.info(`Menu diupdate: ${updatedMenu.name}`);
    return updatedMenu;
  }

  async deleteMenu(id: string): Promise<Menu> {
    const menu = await this.repository.findById(id);
    if (!menu) {
      throw new NotFoundError('Menu tidak ditemukan');
    }

    await this.repository.delete(id);

    baseLogger.info(`Menu dihapus: ${menu.name}`);
    return menu;
  }
}

export const menuService = new MenuService();
