import Joi from 'joi';

export const createMenuSchema = Joi.object({
  imageUrl: Joi.string().trim().uri().required().messages({
    'string.empty': 'URL gambar wajib diisi',
    'any.required': 'URL gambar wajib diisi',
    'string.uri': 'URL gambar tidak valid',
  }),
  name: Joi.string().min(1).required().messages({
    'string.empty': 'Nama menu wajib diisi',
    'any.required': 'Nama menu wajib diisi',
    'string.min': 'Nama menu wajib diisi',
  }),
  categoryId: Joi.string().min(1).required().messages({
    'string.empty': 'Kategori wajib dipilih',
    'any.required': 'Kategori wajib dipilih',
    'string.min': 'Kategori wajib dipilih',
  }),
  stock: Joi.number().integer().positive().required().messages({
    'number.base': 'Stock harus berupa angka',
    'number.integer': 'Stock harus berupa bilangan bulat',
    'number.positive': 'Stock harus berupa bilangan positif',
  }),
  productionCapital: Joi.number().positive().required().messages({
    'number.base': 'Modal produksi harus berupa angka',
    'number.positive': 'Modal produksi harus berupa bilangan positif',
  }),
  sellingPrice: Joi.number().positive().required().messages({
    'number.base': 'Harga jual harus berupa angka',
    'number.positive': 'Harga jual harus berupa bilangan positif',
  }),
  profit: Joi.number().required().messages({
    'number.base': 'Keuntungan harus berupa angka',
  }),
  isActive: Joi.boolean().required().messages({
    'boolean.base': 'Status harus berupa boolean',
  }),
});

export const updateMenuSchema = Joi.object({
  imageUrl: Joi.string().trim().uri().optional(),
  name: Joi.string().min(1).optional().messages({
    'string.min': 'Nama menu wajib diisi',
  }),
  categoryId: Joi.string().min(1).optional().messages({
    'string.min': 'Kategori wajib dipilih',
  }),
  stock: Joi.number().integer().positive().optional(),
  productionCapital: Joi.number().positive().optional(),
  sellingPrice: Joi.number().positive().optional(),
  profit: Joi.number().optional(),
  isActive: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    'object.min': 'Minimal satu field harus diupdate',
  });
