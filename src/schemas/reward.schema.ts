import { z } from 'zod';

export const createRewardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Judul Reward wajib diisi' })
    .max(100, { message: 'Judul Reward maksimal 100 karakter' }),
  type: z.enum(['REWARD', 'VOUCHER']),
  description: z
    .string()
    .trim()
    .max(255, { message: 'Deskripsi maksimal 255 karakter' })
    .optional(),
  isActive: z.boolean().default(true),
  points: z.number({ message: 'Poin harus angka' }).int().positive().optional(),
  code: z
    .string()
    .trim()
    .min(1, { message: 'Kode voucher wajib diisi untuk tipe VOUCHER' })
    .max(50, { message: 'Kode voucher maksimal 50 karakter' })
    .optional(),
  expiryDate: z.iso
    .datetime({ message: 'Tanggal kadaluarsa harus dalam format ISO 8601' })
    .optional(),
  conditions: z
    .string()
    .trim()
    .max(255, { message: 'Syarat dan ketentuan maksimal 255 karakter' })
    .optional(),
});

export const updateRewardSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: 'Judul Reward wajib diisi' })
      .max(100, { message: 'Judul Reward maksimal 100 karakter' })
      .optional(),
    type: z.enum(['REWARD', 'VOUCHER']).optional(),
    description: z
      .string()
      .trim()
      .max(255, { message: 'Deskripsi maksimal 255 karakter' })
      .optional(),
    isActive: z.boolean().default(true).optional(),
    points: z
      .number({ message: 'Poin harus angka' })
      .int()
      .positive()
      .optional(),
    code: z
      .string()
      .trim()
      .min(1, { message: 'Kode voucher wajib diisi untuk tipe VOUCHER' })
      .max(50, { message: 'Kode voucher maksimal 50 karakter' })
      .optional(),
    expiryDate: z.iso
      .datetime({ message: 'Tanggal kadaluarsa harus dalam format ISO 8601' })
      .optional(),
    conditions: z
      .string()
      .trim()
      .max(255, { message: 'Syarat dan ketentuan maksimal 255 karakter' })
      .optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'Minimal satu field harus diperbarui',
  });

export type UpdateRewardDTO = z.infer<typeof updateRewardSchema>;

export type CreateRewardDTO = z.infer<typeof createRewardSchema>;
