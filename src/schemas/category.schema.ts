import z from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, { message: 'Nama kategori wajib diisi' }),
  description: z.string().trim().optional(),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    description: z.string().trim().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'Minimal satu field harus diperbarui',
  });

export type CreateCategoryDTO = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
