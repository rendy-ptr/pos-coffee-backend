import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { baseLogger } from '../../middlewares/logger';
import { AuthRequest } from '../../types/auth';

const prisma = new PrismaClient();

export const customerDashboard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.id,
        isDeleted: false,
      },
      include: {
        customerProfile: true,
      },
    });

    if (!user) {
      baseLogger.warn(`Pengguna tidak ditemukan - ID: ${req.user!.id}`);
      res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan',
        errorCode: 'USER_NOT_FOUND',
      });
      return;
    }

    if (user.role !== 'CUSTOMER' || !user.customerProfile) {
      baseLogger.warn(`Profil pelanggan tidak valid - ID: ${req.user!.id}`);
      res.status(403).json({
        success: false,
        message: 'Profil pelanggan tidak valid',
        errorCode: 'INVALID_PROFILE',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Selamat datang di dashboard pelanggan',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profile: {
          loyaltyPoints: user.customerProfile.loyaltyPoints,
        },
      },
    });
  } catch (error) {
    baseLogger.error('Error memuat dashboard pelanggan', {
      userId: req.user!.id,
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      errorCode: 'SERVER_ERROR',
    });
  }
};
