import { Category, Menu } from '@prisma/client';

export interface CreateMenuDTO {
  imageUrl: string;
  name: string;
  categoryId: string;
  stock: number;
  productionCapital: number;
  sellingPrice: number;
  profit: number;
  isActive: boolean;
}

export interface UpdateMenuDTO {
  imageUrl?: string;
  name?: string;
  categoryId?: string;
  stock?: number;
  productionCapital?: number;
  sellingPrice?: number;
  profit?: number;
  isActive?: boolean;
}

export type MenuWithCategory = Menu & {
  category: Category;
};
