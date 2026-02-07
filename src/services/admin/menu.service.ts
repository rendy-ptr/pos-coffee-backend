import { menuRepository } from '@/repositories/admin/menu.repository';
import { categoryRepository } from '@/repositories/admin/category.repository';
import { BusinessError, NotFoundError } from '@/utils/errors';
import {
  menuDetailResponse,
  menuListResponse,
  menuMutateResponse,
} from '@/queries/menu.query';
import type { Menu, Prisma } from '@prisma/client';
import { baseLogger } from '@/middlewares/logger';
import { CreateMenuDTO, UpdateMenuDTO } from '@/schemas/menu.schema';

export class MenuService {
  private repository = menuRepository;

  async getAllMenus(): Promise<menuListResponse[]> {
    return this.repository.findAll();
  }

  async createMenu(data: CreateMenuDTO): Promise<menuMutateResponse> {
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
    });

    baseLogger.info(`Menu dibuat: ${menu.name}`);
    return menu;
  }

  async updateMenu(
    id: string,
    data: UpdateMenuDTO
  ): Promise<menuMutateResponse> {
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

    baseLogger.info(`Menu diperbarui: ${updatedMenu.name}`);
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

  async getMenuDetail(id: string): Promise<menuDetailResponse> {
    const menu = await this.repository.findMenuDetail(id);
    if (!menu) {
      throw new NotFoundError('Menu tidak ditemukan');
    }
    return menu;
  }
}

export const menuService = new MenuService();
