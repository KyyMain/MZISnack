import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(6, 'Minimal 6 karakter'),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().min(1, 'Nama wajib diisi'),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
