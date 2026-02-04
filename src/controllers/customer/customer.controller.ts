import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { baseLogger } from '../../middlewares/logger';
import { AuthRequest } from '../../types/auth/auth.type';

const prisma = new PrismaClient();

export const customerDashboard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      baseLogger.error('user Customer tidak ditemukan');
      res.status(401).json({
        success: false,
        message: 'Autentikasi gagal',
        errorCode: 'NO_USER',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
        isActive: true,
        role: 'CUSTOMER',
      },
      include: {
        customerProfile: true,
      },
    });

    if (!user) {
      baseLogger.warn(`Pengguna tidak ditemukan - ID: ${req.user.id}`);
      res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan atau tidak aktif',
        errorCode: 'USER_NOT_FOUND',
      });
      return;
    }
    if (!user.customerProfile) {
      res.status(403).json({
        success: false,
        message: 'Hanya customer yang bisa mengakses dashboard ini',
        errorCode: 'FORBIDDEN',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Selamat datang di dashboard ${user.name}`,
      data: user,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Mengakses customer dashboard', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengakses customer dashboard',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
