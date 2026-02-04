import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { baseLogger } from '../../middlewares/logger';
import { AuthRequest } from '../../types/auth/auth.type';
import { ApiResponse } from '@/types/response/api.type';

const prisma = new PrismaClient();

export const kasirDashboard = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      baseLogger.error('req.user tidak ditemukan di kasirDashboard');
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
      data: user,
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

import { Prisma } from '@prisma/client';

export const getMemberId = async (
  req: AuthRequest,
  res: Response<ApiResponse<{ id: string; name: string; memberId: string }[]>>
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

    const { q } = req.query;

    const whereCondition: Prisma.UserWhereInput = {
      isActive: true,
      role: 'CUSTOMER',
      customerProfile: {
        isNot: null,
      },
    };

    if (q && typeof q === 'string' && q.length >= 2) {
      whereCondition.OR = [
        {
          customerProfile: {
            member_id: {
              contains: q,
              mode: 'insensitive',
            },
          },
        },
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereCondition,
      select: {
        id: true,
        name: true,
        customerProfile: {
          select: {
            member_id: true,
          },
        },
      },
      take: 10,
      orderBy: {
        customerProfile: {
          member_id: 'asc',
        },
      },
    });

    const transformedUsers = users
      .filter(
        (
          user
        ): user is typeof user & {
          customerProfile: { member_id: string };
        } => {
          return (
            user.customerProfile !== null &&
            user.customerProfile.member_id !== null
          );
        }
      )
      .map(user => ({
        id: user.id,
        name: user.name,
        memberId: user.customerProfile.member_id,
      }));

    res.status(200).json({
      success: true,
      message: `Berhasil mendapatkan ${transformedUsers.length} Member ID`,
      data: transformedUsers,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Mengambil Member ID', {
        error: error.message,
        stack: error.stack,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Mengambil Member ID',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
