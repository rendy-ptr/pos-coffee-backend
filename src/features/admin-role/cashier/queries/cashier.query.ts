import type { Prisma } from '@prisma/client';

export const cashierDetailSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  profilePicture: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  cashierProfile: true,
} satisfies Prisma.UserSelect;

export const cashierListSelect = {
  id: true,
  name: true,
  isActive: true,
  cashierProfile: {
    select: {
      id: true,
      shiftStart: true,
      shiftEnd: true,
      todayOrder: true,
    },
  },
} satisfies Prisma.UserSelect;

export const cashierMutateSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  profilePicture: true,
  isActive: true,
  cashierProfile: {
    select: {
      id: true,
      shiftStart: true,
      shiftEnd: true,
    },
  },
};

export type CashierDetailResponse = Prisma.UserGetPayload<{
  select: typeof cashierDetailSelect;
}>;

export type CashierListResponse = Prisma.UserGetPayload<{
  select: typeof cashierListSelect;
}>;

export type CashierMutateResponse = Prisma.UserGetPayload<{
  select: typeof cashierMutateSelect;
}>;
