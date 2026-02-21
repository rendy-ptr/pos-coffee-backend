import type { Request, Response } from 'express';
import { rewardService } from '@/features/admin-role/reward/services/reward.service';
import type { ApiRes } from '@/types/api.type';
import type { IdParams } from '@/types/params.type';
import { NotFoundError, BusinessError } from '@/utils/errors';
import type { Reward } from '@prisma/client';
import {
  CreateRewardDTO,
  UpdateRewardDTO,
} from '@/features/admin-role/reward/schemas/reward.schema';
import {
  rewardListResponse,
  rewardMutateResponse,
} from '@/features/admin-role/reward/queries/reward.query';

export const handleGetReward = async (
  req: Request,
  res: Response<ApiRes<rewardListResponse[]>>
) => {
  try {
    const rewards = await rewardService.getAllRewards();

    res.status(200).json({
      success: true,
      message: `Berhasil mendapatkan ${rewards.length} Reward`,
      data: rewards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Mengambil Reward',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleCreateReward = async (
  req: Request<{}, {}, CreateRewardDTO>,
  res: Response<ApiRes<rewardMutateResponse>>
) => {
  try {
    const body = req.body;
    const reward = await rewardService.createReward(body);

    res.status(200).json({
      success: true,
      message: `Reward ${reward.name} berhasil dibuat`,
      data: reward,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
        data: null,
      });
      return;
    }

    if (error instanceof BusinessError) {
      res.status(409).json({
        success: false,
        message: error.message,
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Membuat Reward',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleUpdateReward = async (
  req: Request<IdParams, {}, UpdateRewardDTO>,
  res: Response<ApiRes<rewardMutateResponse>>
) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const reward = await rewardService.updateReward(id, body);

    res.status(200).json({
      success: true,
      message: `Reward ${reward.name} berhasil diperbarui`,
      data: reward,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
        data: null,
      });
      return;
    }

    if (error instanceof BusinessError) {
      res.status(409).json({
        success: false,
        message: error.message,
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Memperbarui Reward',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleDeleteReward = async (
  req: Request<IdParams>,
  res: Response<ApiRes<null>>
) => {
  try {
    const { id } = req.params;
    const reward = await rewardService.deleteReward(id);

    res.status(200).json({
      success: true,
      message: `Reward ${reward.name} berhasil dihapus`,
      data: null,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Menghapus Reward',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};

export const handleGetRewardDetail = async (
  req: Request<IdParams>,
  res: Response<ApiRes<Reward>>
) => {
  try {
    const { id } = req.params;
    const reward = await rewardService.getRewardDetail(id);

    res.status(200).json({
      success: true,
      message: `Berhasil mendapatkan detail Reward ${reward.name}`,
      data: reward,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
        data: null,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat Mengambil detail Reward',
      errorCode: 'SERVER_ERROR',
      error: error instanceof Error ? error.message : String(error),
      data: null,
    });
  }
};
