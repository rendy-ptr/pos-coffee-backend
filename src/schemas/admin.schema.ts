import { z } from 'zod';

export const updateAdminProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Nama minimal 2 karakter')
      .max(100)
      .optional(),

    email: z.string().trim().email('Format email tidak valid').optional(),

    phone: z
      .string()
      .trim()
      .regex(/^(?:\+62|62|0)8[1-9][0-9]{6,10}$/, 'Nomor HP tidak valid')
      .optional(),

    profilePicture: z.string().url('URL gambar tidak valid').optional(),

    currentPassword: z.string().min(1, 'Wajib diisi').optional(),
    newPassword: z.string().min(8, 'Minimal 8 karakter').optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Kalau ada field password → semua wajib diisi
    const isChangingPassword =
      data.currentPassword || data.newPassword || data.confirmPassword;

    if (isChangingPassword) {
      if (!data.currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['currentPassword'],
          message: 'Masukkan password saat ini.',
        });
      }
      if (!data.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['newPassword'],
          message: 'Masukkan password baru.',
        });
      }
      if (!data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: 'Konfirmasi password wajib diisi.',
        });
      }

      if (
        data.newPassword &&
        data.currentPassword &&
        data.newPassword === data.currentPassword
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['newPassword'],
          message: 'Password baru harus berbeda dari password lama.',
        });
      }

      if (
        data.newPassword &&
        data.confirmPassword &&
        data.newPassword !== data.confirmPassword
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmPassword'],
          message: 'Konfirmasi password tidak cocok.',
        });
      }
    }

    // Minimal satu field harus dikirim
    const hasAnyField = Object.values(data).some(v => v !== undefined);
    if (!hasAnyField) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Minimal satu field harus di-update.',
      });
    }
  });

export type UpdateAdminProfileSchemaPayload = z.infer<
  typeof updateAdminProfileSchema
>;
