import z from 'zod';

export const createTableSchema = z.object({
  number: z.number().int().min(1, 'Nomor meja minimal 1'),
  capacity: z.number().int().min(1, 'Kapasitas minimal 1'),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE']),
  location: z.enum(['INDOOR', 'OUTDOOR']),
  currentGuests: z.number().int().min(0).optional(),
  reservedBy: z.string().optional(),
  reservedTime: z.string().optional(),
});

export const updateTableSchema = z.object({
  number: z.number().int().min(1, 'Nomor meja minimal 1').optional(),
  capacity: z.number().int().min(1, 'Kapasitas minimal 1').optional(),
  location: z.enum(['INDOOR', 'OUTDOOR']).optional(),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE']).optional(),
  currentGuests: z.number().int().min(0).optional(),
  reservedBy: z.string().optional(),
  reservedTime: z.string().optional(),
});

export type CreateTableDTO = z.infer<typeof createTableSchema>;
export type UpdateTableDTO = z.infer<typeof updateTableSchema>;