import { Request, Response } from 'express';
import { baseLogger } from '@/middlewares/logger';
import { prisma } from '@/utils/prisma';
import type { ApiResponse } from '@/types/response/api.type';

interface PublicCategory {
  id: string;
  name: string;
  icon: string;
}

interface PublicMenu {
  id: string;
  name: string;
  categoryId: string;
  soldCount: number;
  imageUrl: string;
  sellingPrice: number;
  stock: number;
  category: { name: string };
}

export const getPublicCategories = async (
  req: Request,
  res: Response<ApiResponse<PublicCategory[]>>
) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        icon: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      message: 'Kategori berhasil diambil',
      data: categories,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Mengambil Kategori', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getPublicMenus = async (
  req: Request,
  res: Response<ApiResponse<PublicMenu[]>>
) => {
  try {
    const menus = await prisma.menu.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        categoryId: true,
        soldCount: true,
        imageUrl: true,
        sellingPrice: true,
        stock: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      message: 'Menu berhasil diambil',
      data: menus,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Mengambil Menu', {
        error: error.message,
        stack: error.stack,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
