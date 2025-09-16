import { z } from 'zod';

export const createRewardSchema = z
  .object({
    title: z.string().min(3).max(100),
    type: z.enum(['REWARD', 'VOUCHER']),
    description: z.string().max(500).optional(),
    points: z.number({ error: 'Poin harus angka' }).int().positive().optional(),
    code: z.string().min(3).max(50).optional(),

    expiryDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid (YYYY-MM-DD)')
      .optional()
      .transform(val => (val === '' ? undefined : val)),

    conditions: z.string().max(500).optional(),
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'REWARD' && (!data.points || data.points <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['points'],
        message: 'Poin wajib diisi untuk tipe REWARD',
      });
    }

    if (data.type === 'VOUCHER') {
      if (!data.code) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['code'],
          message: 'Kode voucher wajib diisi untuk tipe VOUCHER',
        });
      }
      if (!data.expiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['expiryDate'],
          message: 'Tanggal kadaluarsa wajib diisi untuk tipe VOUCHER',
        });
      }
    }
  });

export const updateRewardSchema = z
  .object({
    title: z.string().min(3).max(100).optional(),
    type: z.enum(['REWARD', 'VOUCHER']).optional(),
    description: z.string().max(500).optional(),
    points: z.number({ error: 'Poin harus angka' }).int().positive().optional(),
    code: z.string().min(3).max(50).optional(),
    expiryDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal tidak valid (YYYY-MM-DD)')
      .optional()
      .transform(val => (val === '' ? undefined : val)),
    conditions: z.string().max(500).optional(),
    isActive: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === 'REWARD' &&
      'points' in data &&
      (!data.points || data.points <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['points'],
        message: 'Poin wajib diisi untuk tipe REWARD',
      });
    }

    if (data.type === 'VOUCHER') {
      if ('code' in data && !data.code) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['code'],
          message: 'Kode voucher wajib diisi untuk tipe VOUCHER',
        });
      }
      if ('expiryDate' in data && !data.expiryDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['expiryDate'],
          message: 'Tanggal kadaluarsa wajib diisi untuk tipe VOUCHER',
        });
      }
    }
  });

export type UpdateRewardInputPayload = z.infer<typeof updateRewardSchema>;

export type CreateRewardInputPayload = z.infer<typeof createRewardSchema>;
