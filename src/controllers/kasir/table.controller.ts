import { prisma } from '@/utils/prisma';
import { Response } from 'express';
import { baseLogger } from '@/middlewares/logger';
import { AuthRequest } from '@/types/auth';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Table } from '@prisma/client';

export const getTables = async (
  req: AuthRequest,
  res: Response<ApiResponse<Table[]>>
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
    const tables = await prisma.table.findMany({
      orderBy: { number: 'asc' },
    });

    baseLogger.info(`Meja aktif diambil oleh ${user.role} - ${user.id}`);
    res.status(200).json({
      success: true,
      message: 'Meja aktif berhasil diambil',
      data: tables,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Mengambil Table', {
        error: error.message,
        stack: error.stack,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Mengambil Table',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
