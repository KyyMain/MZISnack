'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addressSchema } from '@/lib/validators/address';
import { checkoutSchema } from '@/lib/validators/order';
import { createServerActionClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getPaymentGateway } from '@/lib/payments/resolver';

function generateOrderCode() {
  const now = new Date();
  return `ORD-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now
    .getDate()
    .toString()
    .padStart(2, '0')}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function createAddress(values: Record<string, unknown>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/sign-in');
  }

  const parsed = addressSchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Data alamat tidak valid');
  }

  const supabase = createServerActionClient();

  if (parsed.data.is_default) {
    await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
  }

  const { error } = await supabase.from('addresses').insert({
    ...parsed.data,
    user_id: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/checkout');
}

export async function checkoutOrder(payload: { addressId: number; notes?: string }) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: 'Anda harus masuk.' };
  }

  const parsed = checkoutSchema.safeParse({ address_id: payload.addressId, notes: payload.notes });
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Data tidak valid' };
  }

  const supabase = createServerActionClient();

  const { data: address } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', parsed.data.address_id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!address) {
    return { success: false, message: 'Alamat tidak ditemukan.' };
  }

  const { data: cart } = await supabase
    .from('carts')
    .select(
      'id, cart_items ( id, product_id, qty, price_snapshot, products ( id, stock, seller_id, name ) )',
    )
    .eq('user_id', user.id)
    .maybeSingle();

  if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
    return { success: false, message: 'Keranjang kosong.' };
  }

  const sellerIds = new Set(
    cart.cart_items.map((item) => getProductRecord(item.products)?.seller_id ?? null),
  );
  if (sellerIds.size > 1) {
    return { success: false, message: 'Checkout per penjual terlebih dahulu.' };
  }

  const items = cart.cart_items;
  const firstProduct = getProductRecord(items[0]?.products);
  const sellerId = firstProduct?.seller_id;
  if (!sellerId) {
    return { success: false, message: 'Penjual tidak dikenali.' };
  }

  for (const item of items) {
    const productRecord = getProductRecord(item.products);
    if ((productRecord?.stock ?? 0) < item.qty) {
      return { success: false, message: `Stok tidak cukup untuk ${productRecord?.name ?? 'produk'}` };
    }
  }

  const totalAmount = items.reduce((acc, item) => acc + item.qty * item.price_snapshot, 0);
  const orderCode = generateOrderCode();
  const paymentDriver = process.env.PAYMENT_DRIVER ?? 'fake';

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      code: orderCode,
      buyer_id: user.id,
      seller_id: sellerId,
      total_amount: totalAmount,
      shipping_cost: 0,
      status: 'awaiting_payment',
      payment_driver: paymentDriver,
    })
    .select('id, code')
    .maybeSingle();

  if (orderError || !order) {
    return { success: false, message: 'Gagal membuat pesanan.' };
  }

  const { error: itemsError } = await supabase.from('order_items').insert(
    items.map((item) => {
      const productRecord = getProductRecord(item.products);
      return {
        order_id: order.id,
        product_id: item.product_id,
        product_name_snapshot: productRecord?.name ?? 'Produk',
        price: item.price_snapshot,
        qty: item.qty,
        subtotal: item.qty * item.price_snapshot,
      };
    }),
    ),
  );

  if (itemsError) {
    return { success: false, message: 'Gagal menyimpan detail pesanan.' };
  }

  await supabase.from('cart_items').delete().eq('cart_id', cart.id);

  revalidatePath('/cart');
  revalidatePath('/orders');

  const gateway = getPaymentGateway();
  const paymentInit = await gateway.initiate(order.code);

  if (paymentInit.token) {
    await supabase.from('orders').update({ payment_ref: paymentInit.token }).eq('id', order.id);
  }

  if (paymentInit.redirect_url) {
    return { success: true, redirectUrl: paymentInit.redirect_url };
  }

  return { success: true };
}
const getProductRecord = <T>(relation: T | T[] | null | undefined): T | null => {
  if (!relation) return null;
  return Array.isArray(relation) ? relation[0] ?? null : relation;
};
