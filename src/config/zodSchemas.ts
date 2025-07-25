import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Nama lengkap tidak boleh kosong'),
  email: z.email('Email tidak valid'),
  password: z
    .string()
    .min(8, 'Password harus minimal 8 karakter')
    .regex(/[a-zA-Z]/, 'Password harus mengandung huruf')
    .regex(/\d/, 'Password harus mengandung angka'),
});

export const loginSchema = z.object({
  email: z.email('Email tidak valid'),
  password: z
    .string()
    .min(8, 'Password harus minimal 8 karakter')
    .regex(/[a-zA-Z]/, 'Password harus mengandung huruf')
    .regex(/\d/, 'Password harus mengandung angka'),
});
