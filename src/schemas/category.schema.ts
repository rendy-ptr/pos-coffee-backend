import Joi from 'joi';

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Nama kategori wajib diisi',
    'any.required': 'Nama kategori wajib diisi',
  }),
  description: Joi.string().trim().allow('').optional(),
  icon: Joi.string().trim().required().messages({
    'string.empty': 'Icon kategori wajib diisi',
    'any.required': 'Icon kategori wajib diisi',
  }),
  isActive: Joi.boolean().default(true),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().allow('').optional(),
  icon: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
})
  .min(1)
  .messages({
    'object.min': 'Minimal satu field harus diupdate',
  });
