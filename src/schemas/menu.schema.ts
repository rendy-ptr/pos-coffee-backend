import { z } from 'zod';

export const createMenuSchema = z.object({
  imageUrl: z.url().trim().min(1, { message: 'URL gambar wajib diisi' }),
  name: z.string().trim().min(1, { message: 'Nama menu wajib diisi' }),
  categoryId: z.string().min(1, { message: 'Kategori wajib dipilih' }),
  stock: z
    .number()
    .positive()
    .min(1, { message: 'Stock harus berupa bilangan positif' }),
  productionCapital: z
    .number()
    .positive()
    .min(1, { message: 'Modal produksi harus berupa bilangan positif' }),
  sellingPrice: z
    .number()
    .positive()
    .min(1, { message: 'Harga jual harus berupa bilangan positif' }),
  profit: z
    .number()
    .min(1, { message: 'Keuntungan harus berupa bilangan positif' }),
  isActive: z.boolean().default(true),
});

export const updateMenuSchema = z
  .object({
    imageUrl: z
      .url()
      .trim()
      .min(1, { message: 'URL gambar wajib diisi' })
      .optional(),
    name: z
      .string()
      .trim()
      .min(1, { message: 'Nama menu wajib diisi' })
      .optional(),
    categoryId: z
      .string()
      .min(1, { message: 'Kategori wajib dipilih' })
      .optional(),
    stock: z
      .number()
      .positive()
      .min(1, { message: 'Stock harus berupa bilangan positif' })
      .optional(),
    productionCapital: z
      .number()
      .positive()
      .min(1, { message: 'Modal produksi harus berupa bilangan positif' })
      .optional(),
    sellingPrice: z
      .number()
      .positive()
      .min(1, { message: 'Harga jual harus berupa bilangan positif' })
      .optional(),
    profit: z
      .number()
      .min(1, { message: 'Keuntungan harus berupa bilangan positif' })
      .optional(),
    isActive: z.boolean().default(true).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'Minimal satu field harus diperbarui',
  });

export type CreateMenuDTO = z.infer<typeof createMenuSchema>;
export type UpdateMenuDTO = z.infer<typeof updateMenuSchema>;
