import { z } from 'zod';

export const createKasirSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nama kasir wajib diisi' }),

  email: z.email({ message: 'Email tidak valid' }),

  phone: z
    .string()
    .trim()
    .min(10, { message: 'Nomor telepon minimal 10 digit' }),

  profilePicture: z.string().optional(),

  shiftStart: z.string().min(1, { message: 'Waktu mulai shift wajib diisi' }),

  shiftEnd: z.string().min(1, { message: 'Waktu selesai shift wajib diisi' }),

  isActive: z.boolean().default(true),
});

export const updateKasirSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.email().optional(),
    phone: z.string().trim().min(10).optional(),
    profilePicture: z.string().optional(),
    shiftStart: z.string().min(1).optional(),
    shiftEnd: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'Minimal satu field harus diperbarui',
  });

export type CreateKasirDTO = z.infer<typeof createKasirSchema>;
export type UpdateKasirDTO = z.infer<typeof updateKasirSchema>;
