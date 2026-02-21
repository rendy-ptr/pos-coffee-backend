import { rewardRepository } from '@/features/admin-role/reward/repositories/reward.repository';
import { BusinessError, NotFoundError } from '@/utils/errors';
import {
  rewardListResponse,
  rewardMutateResponse,
} from '@/features/admin-role/reward/queries/reward.query';
import type { Reward } from '@prisma/client';
import { baseLogger } from '@/middlewares/logger';
import {
  CreateRewardDTO,
  UpdateRewardDTO,
} from '@/features/admin-role/reward/schemas/reward.schema';

export class RewardService {
  private repository = rewardRepository;

  async getAllRewards(): Promise<rewardListResponse[]> {
    return this.repository.getAll();
  }

  async createReward(data: CreateRewardDTO): Promise<rewardMutateResponse> {
    const existingReward = await this.repository.findByName(data.name);
    if (existingReward) {
      throw new BusinessError('Reward dengan judul tersebut sudah ada');
    }

    const reward = await this.repository.create(data);

    baseLogger.info(`Reward dibuat: ${reward.name}`);
    return reward;
  }

  async updateReward(
    id: string,
    data: UpdateRewardDTO
  ): Promise<rewardMutateResponse> {
    const existingReward = await this.repository.findById(id);
    if (!existingReward) {
      throw new NotFoundError('Reward tidak ditemukan');
    }

    if (data.name && data.name !== existingReward.name) {
      const duplicateReward = await this.repository.findByName(data.name);
      if (duplicateReward) {
        throw new BusinessError('Reward dengan judul tersebut sudah ada');
      }
    }

    const updatedReward = await this.repository.update(id, data);

    baseLogger.info(`Reward diperbarui: ${updatedReward.name}`);
    return updatedReward;
  }

  async deleteReward(id: string): Promise<Reward> {
    const existingReward = await this.repository.findById(id);
    if (!existingReward) {
      throw new NotFoundError('Reward tidak ditemukan');
    }

    const deletedReward = await this.repository.delete(id);

    baseLogger.info(`Reward dihapus: ${deletedReward.name}`);
    return deletedReward;
  }

  async getRewardDetail(id: string): Promise<Reward> {
    const reward = await this.repository.findRewardDetail(id);
    if (!reward) {
      throw new NotFoundError('Reward tidak ditemukan');
    }
    return reward;
  }
}

export const rewardService = new RewardService();
