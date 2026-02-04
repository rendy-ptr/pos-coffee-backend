import { prisma } from '@/utils/prisma';
import type { Category } from '@prisma/client';
import type { AuthRequest } from '../../types/auth/auth.type';
import type { ApiResponse } from '@/types/response/api.type';
import { baseLogger } from '@/middlewares/logger';
import { Response } from 'express';

export const getActiveCategories = async (
  req: AuthRequest,
  res: Response<ApiResponse<Category[]>>
) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User kasir tidak ditemukan pada request',
      });
      return;
    }
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    baseLogger.info(`Kategori aktif diambil oleh ${user.role} - ${user.id}`);
    res.status(200).json({
      success: true,
      message: 'Kategori aktif berhasil diambil',
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
      message: 'Terjadi kesalahan saat mengambil Kategori',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
