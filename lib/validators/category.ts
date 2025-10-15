import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi'),
  slug: z
    .string()
    .min(1, 'Slug wajib diisi')
    .regex(/^[a-z0-9-]+$/, 'Gunakan huruf kecil, angka, dan tanda hubung'),
  description: z.string().optional().nullable(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
