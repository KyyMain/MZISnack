'use server';

import { revalidatePath } from 'next/cache';
import { addToCartSchema } from '@/lib/validators/cart';
import { createServerActionClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';

export async function addToCart(payload: { productId: number; qty: number }) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Silakan masuk terlebih dahulu.' };
  }

  const parsed = addToCartSchema.safeParse({
    product_id: payload.productId,
    qty: payload.qty,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Data tidak valid' };
  }

  const supabase = createServerActionClient();

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, price, stock, seller_id, is_active')
    .eq('id', parsed.data.product_id)
    .maybeSingle();

  if (productError || !product || !product.is_active) {
    return { success: false, message: 'Produk tidak tersedia.' };
  }

  if (product.stock < parsed.data.qty) {
    return { success: false, message: 'Stok produk tidak mencukupi.' };
  }

  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  let cartId = cart?.id;

  if (!cartId) {
    const { data: newCart, error: createError } = await supabase
      .from('carts')
      .insert({ user_id: user.id })
      .select('id')
      .maybeSingle();

    if (createError || !newCart) {
      return { success: false, message: 'Gagal membuat keranjang.' };
    }
    cartId = newCart.id;
  }

  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('id, qty')
    .eq('cart_id', cartId)
    .eq('product_id', product.id)
    .maybeSingle();

  const nextQty = (existingItem?.qty ?? 0) + parsed.data.qty;

  if (nextQty > product.stock) {
    return { success: false, message: 'Jumlah melebihi stok tersedia.' };
  }

  if (existingItem) {
    const { error } = await supabase
      .from('cart_items')
      .update({ qty: nextQty, price_snapshot: product.price })
      .eq('id', existingItem.id);

    if (error) {
      return { success: false, message: 'Gagal memperbarui keranjang.' };
    }
  } else {
    const { error } = await supabase.from('cart_items').insert({
      cart_id: cartId,
      product_id: product.id,
      qty: parsed.data.qty,
      price_snapshot: product.price,
    });

    if (error) {
      return { success: false, message: 'Gagal menambahkan produk.' };
    }
  }

  revalidatePath('/cart');
  revalidatePath('/');

  return { success: true };
}
