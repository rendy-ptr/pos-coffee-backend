import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email().trim().min(1, { message: 'Email wajib diisi' }),
  password: z.string().trim().min(1, { message: 'Password wajib diisi' }),
});

export type LoginDTO = z.infer<typeof loginSchema>;
