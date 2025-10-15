import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  slug: z
    .string()
    .min(1, 'Slug wajib diisi')
    .regex(/^[a-z0-9-]+$/, 'Gunakan huruf kecil, angka, dan tanda hubung'),
  description: z.string().min(1, 'Deskripsi wajib diisi'),
  category_id: z.number({ invalid_type_error: 'Kategori wajib dipilih' }).optional().nullable(),
  price: z.coerce.number().int().min(0, 'Harga tidak boleh negatif'),
  stock: z.coerce.number().int().min(0, 'Stok minimal 0'),
  is_active: z.boolean().default(true),
  images: z.array(z.string().url('URL gambar tidak valid')).default([]),
});

export type ProductInput = z.infer<typeof productSchema>;
