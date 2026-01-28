import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Nama lengkap wajib diisi',
    'any.required': 'Nama lengkap wajib diisi',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email wajib diisi',
    'any.required': 'Email wajib diisi',
    'string.email': 'Email tidak valid',
  }),
  password: Joi.string().trim().required().messages({
    'string.empty': 'Password wajib diisi',
    'any.required': 'Password wajib diisi',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email wajib diisi',
    'any.required': 'Email wajib diisi',
    'string.email': 'Email tidak valid',
  }),
  password: Joi.string().trim().required().messages({
    'string.empty': 'Password wajib diisi',
    'any.required': 'Password wajib diisi',
  }),
});
