import { z } from 'zod';
import { TableStatus, TableLocation } from '@prisma/client';

export const TableStatusEnum = z.enum([
  'AVAILABLE',
  'OCCUPIED',
  'RESERVED',
  'MAINTENANCE',
]);

export const TableLocationEnum = z.enum(['INDOOR', 'OUTDOOR']);

export const tableBaseSchema = z.object({
  id: z.string().cuid(),
  number: z.number().int().min(1),
  capacity: z.number().int().min(1),
  status: z.nativeEnum(TableStatus),
  currentGuests: z.number().int().min(0),
  location: z.nativeEnum(TableLocation),
  lastCleaned: z.date(),
  reservedBy: z.string().nullable(),
  reservedTime: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdById: z.string().cuid(),
});

export const createTableSchema = z.object({
  number: z.number().int().min(1, 'Nomor meja minimal 1'),
  capacity: z.number().int().min(1, 'Kapasitas minimal 1'),
  location: TableLocationEnum,
});

// Semua field optional
export const updateTableSchema = z
  .object({
    number: z.number().int().min(1, 'Nomor meja minimal 1').optional(),
    capacity: z.number().int().min(1, 'Kapasitas minimal 1').optional(),
    status: TableStatusEnum.optional(),
    location: TableLocationEnum.optional(),
    currentGuests: z
      .number()
      .int()
      .min(0)
      .max(20, 'Maksimal 20 tamu')
      .optional(),
    lastCleaned: z
      .string()
      .optional()
      .transform(val => {
        if (!val) return undefined;
        const formattedVal = val.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
          ? `${val}:00`
          : val;
        const date = new Date(formattedVal);
        return isNaN(date.getTime()) ? undefined : date.toISOString();
      })
      .refine(val => !val || !isNaN(new Date(val).getTime()), {
        message: 'Format datetime tidak valid untuk lastCleaned',
      }),
    reservedBy: z
      .string()
      .optional()
      .refine(
        val => {
          if (!val) return true; // Izinkan kosong
          const nameRegex = /^[A-Za-z\s\-'\u00C0-\u017F]+$/;
          return nameRegex.test(val);
        },
        {
          message:
            'Nama hanya boleh berisi huruf, spasi, tanda hubung, atau apostrof',
        }
      )
      .transform(val => (val ? val.trim() : undefined)),
    reservedTime: z
      .string()
      .optional()
      .transform(val => {
        if (!val) return undefined;
        const formattedVal = val.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
          ? `${val}:00`
          : val;
        const date = new Date(formattedVal);
        return isNaN(date.getTime()) ? undefined : date.toISOString();
      })
      .refine(val => !val || !isNaN(new Date(val).getTime()), {
        message: 'Format datetime tidak valid untuk reservedTime',
      }),
  })
  .refine(
    data => {
      if (data.status === 'RESERVED') {
        return data.reservedBy && data.reservedTime;
      }
      return true;
    },
    {
      message: 'reservedBy dan reservedTime wajib diisi jika status RESERVED',
      path: ['reservedBy'],
    }
  )
  .refine(
    data => {
      if (data.currentGuests !== undefined && data.capacity !== undefined) {
        return data.currentGuests <= data.capacity;
      }
      return true;
    },
    {
      message: 'Jumlah tamu saat ini tidak boleh melebihi kapasitas',
      path: ['currentGuests'],
    }
  )
  .refine(
    data => {
      if (data.status && data.status !== 'RESERVED') {
        return !data.reservedBy && !data.reservedTime;
      }
      return true;
    },
    {
      message: 'Data reservasi harus dihapus jika status bukan RESERVED',
      path: ['status'],
    }
  );
export const tableParamsSchema = z.object({
  id: z.string().cuid(),
});

// Type infer untuk BE
export type TableEntity = z.infer<typeof tableBaseSchema>;
export type UpdateTableBackendInput = z.infer<typeof updateTableSchema>;
export type CreateTableBackendInput = z.infer<typeof createTableSchema>;
