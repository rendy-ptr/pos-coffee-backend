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
    // Pastikan req.user ada (meskipun middleware seharusnya menjamin ini)
    if (!req.user) {
      baseLogger.error('req.user tidak ditemukan di customerDashboard');
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
        loyaltyPoints: true,
        phone: true,
        profilePicture: true,
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

    // Ambil pesanan pelanggan (opsional, jika diperlukan)
    // const orders = await prisma.order.findMany({
    //   where: {
    //     customerId: req.user.id, // Sesuaikan dengan nama kolom di model Order
    //   },
    //   take: 10, // Batasi jumlah pesanan untuk performa
    // });

    res.status(200).json({
      success: true,
      message: 'Selamat datang di dashboard pelanggan',
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: req.user.role,
        loyaltyPoints: user.loyaltyPoints,
        phoneNumber: user.phone,
        profilePicture: user.profilePicture,
        // orders,
      },
    });
  } catch (error) {
    baseLogger.error('Error memuat dashboard pelanggan', {
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
