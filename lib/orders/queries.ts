import { cache } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import type { Tables } from '@/lib/supabase/database.types';

export const getBuyerOrders = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = createServerClient();
  const { data } = await supabase
    .from('orders')
    .select('id, code, total_amount, status, created_at, seller:profiles!orders_seller_id_fkey ( id, name )')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false });

  return data ?? [];
});

export async function getOrderDetail(code: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('orders')
    .select(
      `
      id,
      code,
      total_amount,
      status,
      created_at,
      payment_driver,
      payment_ref,
      payment_meta,
      seller:profiles!orders_seller_id_fkey ( id, name ),
      buyer:profiles!orders_buyer_id_fkey ( id, name ),
      order_items ( id, product_id, product_name_snapshot, price, qty, subtotal )
    `,
    )
    .eq('code', code)
    .maybeSingle();

  return data ?? null;
}

export const getSellerOrders = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = createServerClient();
  const { data } = await supabase
    .from('orders')
    .select('id, code, total_amount, status, created_at, buyer:profiles!orders_buyer_id_fkey ( id, name )')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  return data ?? [];
});
