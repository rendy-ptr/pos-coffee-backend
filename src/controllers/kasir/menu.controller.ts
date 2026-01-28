import { prisma } from '@/utils/prisma';
import { baseLogger } from '@/middlewares/logger';
import type { ApiResponse } from '@/types/ApiResponse';
import { AuthRequest } from '@/types/auth';
import { Response } from 'express';

type MenuWithCategory = {
  id: string;
  imageUrl: string;
  name: string;
  sellingPrice: number;
  stock: number;
  category: {
    id: string;
    name: string;
    description: string | null;
    icon: string;
  };
};

export const getMenus = async (
  req: AuthRequest,
  res: Response<ApiResponse<MenuWithCategory[]>>
) => {
  try {
    const { user } = req;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User Kasir tidak ditemukan pada request',
      });
      return;
    }

    const menus = await prisma.menu.findMany({
      where: { isActive: true },
      select: {
        id: true,
        imageUrl: true,
        name: true,
        sellingPrice: true,
        stock: true,
        category: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `Berhasil mendapatkan ${menus.length} Menu`,
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
      message: 'Terjadi kesalahan saat Mengambil Menu',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
