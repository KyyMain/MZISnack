'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { productSchema, type ProductInput } from '@/lib/validators/product';
import { createServerActionClient } from '@/lib/supabase/server';
import { requireSeller } from '@/lib/auth/guards';

export async function createProduct(values: ProductInput) {
  const seller = await requireSeller();

  const parsed = productSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Data produk tidak valid');
  }

  const supabase = createServerActionClient();
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      seller_id: seller.id,
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      category_id: parsed.data.category_id ?? null,
      price: parsed.data.price,
      stock: parsed.data.stock,
      is_active: parsed.data.is_active,
    })
    .select('id')
    .maybeSingle();

  if (error || !product) {
    throw new Error(error?.message ?? 'Gagal menyimpan produk');
  }

  if (parsed.data.images.length > 0) {
    await supabase.from('product_images').insert(
      parsed.data.images.map((url, index) => ({
        product_id: product.id,
        url,
        sort_order: index,
      })),
    );
  }

  revalidatePath('/seller/products');
  redirect('/seller/products');
}

export async function updateProduct(productId: number, values: ProductInput) {
  const seller = await requireSeller();

  const parsed = productSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Data produk tidak valid');
  }

  const supabase = createServerActionClient();
  const { error } = await supabase
    .from('products')
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      category_id: parsed.data.category_id ?? null,
      price: parsed.data.price,
      stock: parsed.data.stock,
      is_active: parsed.data.is_active,
    })
    .eq('id', productId)
    .eq('seller_id', seller.id);

  if (error) {
    throw new Error(error.message ?? 'Gagal memperbarui produk');
  }

  await supabase.from('product_images').delete().eq('product_id', productId);

  if (parsed.data.images.length > 0) {
    await supabase.from('product_images').insert(
      parsed.data.images.map((url, index) => ({
        product_id: productId,
        url,
        sort_order: index,
      })),
    );
  }

  revalidatePath('/seller/products');
  redirect('/seller/products');
}
