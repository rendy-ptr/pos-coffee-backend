import type { Prisma } from '@prisma/client';

export const menuListSelect = {
  id: true,
  name: true,
  sellingPrice: true,
  stock: true,
  soldCount: true,
  isActive: true,
  category: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.MenuSelect;

export const menuMutateSelect = {
  id: true,
  name: true,
  imageUrl: true,
  categoryId: true,
  stock: true,
  productionCapital: true,
  sellingPrice: true,
  profit: true,
  isActive: true,
} satisfies Prisma.MenuSelect;

export type menuListResponse = Prisma.MenuGetPayload<{
  select: typeof menuListSelect;
}>;

export type menuMutateResponse = Prisma.MenuGetPayload<{
  select: typeof menuMutateSelect;
}>;

export type menuDetailResponse = Prisma.MenuGetPayload<{
  include: {
    category: true;
  };
}>;
