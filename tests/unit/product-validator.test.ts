import { describe, expect, it } from 'vitest';
import { productSchema } from '@/lib/validators/product';

describe('productSchema', () => {
  it('rejects invalid slug characters', () => {
    const result = productSchema.safeParse({
      name: 'Produk',
      slug: 'Slug Salah',
      description: 'Deskripsi',
      category_id: undefined,
      price: 5000,
      stock: 10,
      is_active: true,
      images: [],
    } as any);

    expect(result.success).toBe(false);
  });
});
