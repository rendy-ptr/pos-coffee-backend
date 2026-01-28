import type { Response } from 'express';
import { baseLogger } from '../../middlewares/logger';
import { AuthRequest } from '../../types/auth';
import { prisma } from '@/utils/prisma';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Prisma } from '@prisma/client';
import { updateAdminProfileSchema } from '@/schemas/admin.schema';

type AdminWithProfile = Prisma.UserGetPayload<{
  include: { adminProfile: true };
}>;

export const adminDashboard = async (
  req: AuthRequest,
  res: Response<ApiResponse<AdminWithProfile>>
) => {
  try {
    if (!req.user) {
      baseLogger.error('User Admin tidak ditemukan');
      res.status(401).json({
        success: false,
        message: 'Autentikasi gagal',
        errorCode: 'NO_USER',
      });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        id: req.user.id,
        isActive: true,
        role: 'ADMIN',
      },
      include: {
        adminProfile: true,
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
    if (!user.adminProfile) {
      res.status(403).json({
        success: false,
        message: 'Hanya admin yang bisa mengakses dashboard ini',
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
    baseLogger.error('Error memuat dashboard admin', {
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

export const editAdminProfile = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User Admin tidak ditemukan pada request',
      });
      return;
    }

    if (!id) {
      res.status(400).json({
        success: false,
        message: 'ID admin wajib ada',
      });
      return;
    }

    const existingAdmin = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      res.status(404).json({
        success: false,
        message: 'Admin tidak ditemukan',
      });
      return;
    }

    const parsed = updateAdminProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: parsed.error.issues,
      });
      return;
    }

    const payload = parsed.data;

    const updatedAdminProfile = await prisma.user.update({
      where: { id },
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        profilePicture: payload.profilePicture,
      },
    });

    baseLogger.info(`Admin Profile di update: ${updatedAdminProfile.name}`);

    res.status(200).json({
      success: true,
      message: `Admin Profile ${updatedAdminProfile.name} berhasil diperbarui`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Mengedit Admin Profile', {
        error: error.message,
        stack: error.stack,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengedit Admin Profile',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
