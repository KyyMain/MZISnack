'use server';

import { revalidatePath } from 'next/cache';
import { createServerActionClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { updateCartSchema } from '@/lib/validators/cart';

export async function updateCartItem(payload: { itemId: number; qty: number }) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Anda harus masuk.' };
  }

  const parsed = updateCartSchema.safeParse({
    item_id: payload.itemId,
    qty: payload.qty,
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Data tidak valid' };
  }

  const supabase = createServerActionClient();

  const { data: item } = await supabase
    .from('cart_items')
    .select('id, cart_id, products ( stock )')
    .eq('id', parsed.data.item_id)
    .maybeSingle();

  if (!item) {
    return { success: false, message: 'Item tidak ditemukan.' };
  }

  const { data: cart } = await supabase
    .from('carts')
    .select('id, user_id')
    .eq('id', item.cart_id)
    .maybeSingle();

  if (!cart || cart.user_id !== user.id) {
    return { success: false, message: 'Tidak diizinkan.' };
  }

  if (parsed.data.qty === 0) {
    const { error } = await supabase.from('cart_items').delete().eq('id', parsed.data.item_id);
    if (error) {
      return { success: false, message: 'Gagal menghapus item.' };
    }
  } else {
    const stock = item.products?.stock ?? 0;
    if (parsed.data.qty > stock) {
      return { success: false, message: 'Jumlah melebihi stok.' };
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ qty: parsed.data.qty })
      .eq('id', parsed.data.item_id);
    if (error) {
      return { success: false, message: 'Gagal memperbarui keranjang.' };
    }
  }

  revalidatePath('/cart');
  return { success: true };
}

export async function removeCartItem(payload: { itemId: number }) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Anda harus masuk.' };
  }

  const supabase = createServerActionClient();

  const { data: item } = await supabase
    .from('cart_items')
    .select('id, cart_id')
    .eq('id', payload.itemId)
    .maybeSingle();

  if (!item) {
    return { success: false, message: 'Item tidak ditemukan.' };
  }

  const { data: cart } = await supabase
    .from('carts')
    .select('id, user_id')
    .eq('id', item.cart_id)
    .maybeSingle();

  if (!cart || cart.user_id !== user.id) {
    return { success: false, message: 'Tidak diizinkan.' };
  }

  const { error } = await supabase.from('cart_items').delete().eq('id', payload.itemId);
  if (error) {
    return { success: false, message: 'Gagal menghapus item.' };
  }

  revalidatePath('/cart');
  return { success: true };
}
