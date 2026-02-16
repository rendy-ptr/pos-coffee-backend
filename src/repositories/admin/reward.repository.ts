import { prisma } from '@/utils/prisma';
import type { Reward, Prisma } from '@prisma/client';
import type {
  rewardListResponse,
  rewardMutateResponse,
} from '@/queries/reward.query';
import { rewardListSelect, rewardMutateSelect } from '@/queries/reward.query';

export class RewardRepository {
  async getAll(): Promise<rewardListResponse[]> {
    return prisma.reward.findMany({
      orderBy: { createdAt: 'desc' },
      select: rewardListSelect,
    }) as Promise<rewardListResponse[]>;
  }

  async findById(id: string): Promise<Reward | null> {
    return prisma.reward.findUnique({
      where: { id },
    });
  }

  async findByName(name: string): Promise<Reward | null> {
    return prisma.reward.findUnique({
      where: { name },
    });
  }

  async create(data: Prisma.RewardCreateInput): Promise<rewardMutateResponse> {
    return prisma.reward.create({
      data,
      select: rewardMutateSelect,
    }) as Promise<rewardMutateResponse>;
  }

  async update(
    id: string,
    data: Prisma.RewardUpdateInput
  ): Promise<rewardMutateResponse> {
    return prisma.reward.update({
      where: { id },
      data,
      select: rewardMutateSelect,
    }) as Promise<rewardMutateResponse>;
  }

  async delete(id: string): Promise<Reward> {
    return prisma.reward.delete({
      where: { id },
    });
  }

  async findRewardDetail(id: string): Promise<Reward | null> {
    return prisma.reward.findUnique({
      where: { id },
    });
  }
}

export const rewardRepository = new RewardRepository();
