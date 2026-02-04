import { baseLogger } from '@/middlewares/logger';
import {
  createRewardSchema,
  updateRewardSchema,
} from '@/schemas/reward.schema';
import { ApiResponse } from '@/types/response/api.type';
import { AuthRequest } from '@/types/auth/auth.type';
import { prisma } from '@/utils/prisma';
import { Reward } from '@prisma/client';
import { Response } from 'express';

export const createReward = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User Admin tidak ditemukan pada request',
      });
      return;
    }
    const parsed = createRewardSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errorCode: 'VALIDATION_ERROR',
        error: parsed.error.issues
          .map(issue => `${issue.path.join('.')}: ${issue.message}`)
          .join(', '),
      });
      return;
    }
    const payload = parsed.data;
    const existingReward = await prisma.reward.findUnique({
      where: { title: payload.title },
    });
    if (existingReward) {
      res.status(409).json({
        success: false,
        message: 'Reward dengan judul tersebut sudah ada',
        errorCode: 'UNIQUE_CONSTRAINT_VIOLATION',
      });
      return;
    }
    const reward = await prisma.reward.create({
      data: {
        ...payload,
        expiryDate: payload.expiryDate ? new Date(payload.expiryDate) : null,
        createdById: user.id,
      },
    });
    baseLogger.info(`Reward dibuat: ${reward.title} oleh ${user.role}`);
    res.status(201).json({
      success: true,
      message: `Reward ${reward.title} berhasil dibuat`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Membuat Reward', {
        error: error.message,
        stack: error.stack,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat reward',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getRewards = async (
  req: AuthRequest,
  res: Response<ApiResponse<Reward[]>>
) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User Admin tidak ditemukan pada request',
      });
      return;
    }
    const rewards = await prisma.reward.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({
      success: true,
      message: `Berhasil mendapatkan ${rewards.length} Reward`,
      data: rewards,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Mendapatkan Rewards', {
        error: error.message,
        stack: error.stack,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan rewards',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const editReward = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User Admin tidak ditemukan pada request',
      });
      return;
    }

    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'ID Reward wajib ada pada parameter',
        errorCode: 'VALIDATION_ERROR',
      });
      return;
    }

    const parsed = updateRewardSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errorCode: 'VALIDATION_ERROR',
        error: parsed.error.issues
          .map(issue => `${issue.path.join('.')}: ${issue.message}`)
          .join(', '),
      });
      return;
    }

    const payload = parsed.data;

    // Ambil reward lama
    const reward = await prisma.reward.findUnique({ where: { id } });
    if (!reward) {
      res
        .status(404)
        .json({ success: false, message: 'Reward tidak ditemukan' });
      return;
    }

    // Validasi judul unik
    if (payload.title && payload.title !== reward.title) {
      const existingReward = await prisma.reward.findUnique({
        where: { title: payload.title },
      });
      if (existingReward) {
        res.status(409).json({
          success: false,
          message: 'Reward dengan judul tersebut sudah ada',
          errorCode: 'UNIQUE_CONSTRAINT_VIOLATION',
        });
        return;
      }
    }

    // Siapkan data update
    const updateData: Partial<typeof reward> = {
      title: payload.title ?? reward.title,
      description: payload.description ?? reward.description,
      type: payload.type ?? reward.type,
      conditions: payload.conditions ?? reward.conditions,
      isActive: payload.isActive ?? reward.isActive,
    };

    // Atur field sesuai tipe
    if (payload.type === 'REWARD') {
      updateData.points = payload.points;
      updateData.code = null;
      updateData.expiryDate = null;
    } else if (payload.type === 'VOUCHER') {
      updateData.points = null;
      updateData.code = payload.code;
      updateData.expiryDate = payload.expiryDate
        ? new Date(payload.expiryDate)
        : null;
    }

    await prisma.reward.update({
      where: { id },
      data: updateData,
    });

    baseLogger.info(`Reward di update: ${reward.title} oleh ${user.role}`);
    res.json({
      success: true,
      message: `Reward ${reward.title} berhasil di update`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Mengedit Reward', {
        error: error.message,
        stack: error.stack,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengedit reward',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteReward = async (
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

    const reward = await prisma.reward.findUnique({ where: { id } });
    if (!reward) {
      res.status(404).json({
        success: false,
        message: 'Reward tidak ditemukan',
      });
      return;
    }

    await prisma.reward.delete({ where: { id } });

    baseLogger.info(`Reward dihapus: ${reward.title}`);

    res.status(200).json({
      success: true,
      message: `Reward ${reward.title} berhasil dihapus`,
      data: null,
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error Menghapus Reward', {
        error: error.message,
        stack: error.stack,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus reward',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
