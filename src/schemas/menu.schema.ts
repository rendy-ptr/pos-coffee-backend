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
    imageUrl: z.url().trim().min(1).optional(),
    name: z.string().trim().min(1).optional(),
    categoryId: z.string().min(1).optional(),
    stock: z.number().positive().optional(),
    productionCapital: z.number().positive().optional(),
    sellingPrice: z.number().positive().optional(),
    profit: z.number().optional(),
    isActive: z.boolean().optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'Minimal satu field harus diperbarui',
  });

export type CreateMenuDTO = z.infer<typeof createMenuSchema>;
export type UpdateMenuDTO = z.infer<typeof updateMenuSchema>;
