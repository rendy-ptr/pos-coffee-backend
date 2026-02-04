import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nama wajib diisi' }),
  email: z.email().trim().min(1, { message: 'Email wajib diisi' }),
  password: z.string().trim().min(1, { message: 'Password wajib diisi' }),
});

export const loginSchema = z.object({
  email: z.email().trim().min(1, { message: 'Email wajib diisi' }),
  password: z.string().trim().min(1, { message: 'Password wajib diisi' }),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
