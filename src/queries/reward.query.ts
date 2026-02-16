import type { Prisma } from '@prisma/client';

export const rewardListSelect = {
  id: true,
  name: true,
  type: true,
  isActive: true,
  points: true,
  code: true,
  expiryDate: true,
  createdAt: true,
} satisfies Prisma.RewardSelect;

export const rewardMutateSelect = {
  id: true,
  name: true,
  type: true,
  description: true,
  isActive: true,
  points: true,
  code: true,
  expiryDate: true,
  conditions: true,
};

export type rewardListResponse = Prisma.RewardGetPayload<{
  select: typeof rewardListSelect;
}>;

export type rewardMutateResponse = Prisma.RewardGetPayload<{
  select: typeof rewardMutateSelect;
}>;
