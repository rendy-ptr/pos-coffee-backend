import { Prisma } from '@prisma/client';

type NullableDateFields = {
  lastCleaned?: Date | null;
  reservedTime?: Date | null;
  reservedBy?: string | null;
};

export function prepareNullableDatesForPrisma<T extends NullableDateFields>(
  data: T
): Prisma.TableUpdateInput {
  return {
    ...data,
    lastCleaned:
      data.lastCleaned === null
        ? { set: null }
        : data.lastCleaned
          ? data.lastCleaned
          : undefined,
    reservedTime:
      data.reservedTime === null
        ? { set: null }
        : data.reservedTime
          ? data.reservedTime
          : undefined,
    reservedBy:
      data.reservedBy === null
        ? { set: null }
        : data.reservedBy
          ? data.reservedBy
          : undefined,
  };
}
