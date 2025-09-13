import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { baseLogger } from '../../middlewares/logger';
import { AuthRequest } from '../../types/auth';

const prisma = new PrismaClient();

export const kasirDashboard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Pastikan req.user ada (meskipun middleware seharusnya menjamin ini)
    if (!req.user) {
      baseLogger.error('req.user tidak ditemukan di kasirDashboard');
      res.status(401).json({
        success: false,
        message: 'Autentikasi gagal',
        errorCode: 'NO_USER',
      });
      return;
    }

    // Ambil data pengguna berdasarkan id dari req.user
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        shiftStart: true,
        shiftEnd: true,
        phoneKasir: true,
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

    res.status(200).json({
      success: true,
      message: `Selamat datang di dashboard ${user.name}`,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        shiftStart: user.shiftStart,
        shiftEnd: user.shiftEnd,
        phoneKasir: user.phoneKasir,
      },
    });
  } catch (error) {
    baseLogger.error('Error memuat dashboard kasir', {
      userId: req.user?.id,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat memuat dashboard',
      errorCode: 'SERVER_ERROR',
    });
  }
};
