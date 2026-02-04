import type { Prisma } from '@prisma/client';

export const kasirDetailSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  profilePicture: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  kasirProfile: true,
} satisfies Prisma.UserSelect;

export const kasirListSelect = {
  id: true,
  name: true,
  isActive: true,
  kasirProfile: {
    select: {
      id: true,
      shiftStart: true,
      shiftEnd: true,
      todayOrder: true,
    },
  },
} satisfies Prisma.UserSelect;

export const kasirMutateSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  profilePicture: true,
  isActive: true,
  kasirProfile: {
    select: {
      id: true,
      shiftStart: true,
      shiftEnd: true,
    },
  },
};

export type KasirDetailResponse = Prisma.UserGetPayload<{
  select: typeof kasirDetailSelect;
}>;

export type KasirListResponse = Prisma.UserGetPayload<{
  select: typeof kasirListSelect;
}>;

export type kasirMutateResponse = Prisma.UserGetPayload<{
  select: typeof kasirMutateSelect;
}>;
