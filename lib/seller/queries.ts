import { createServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';

export async function getSellerStats() {
  const user = await getCurrentUser();
  if (!user) return { productCount: 0, orderCount: 0 };

  const supabase = createServerClient();

  const [{ count: productCount }, { count: orderCount }] = await Promise.all([
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', user.id),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', user.id),
  ]);

  return {
    productCount: productCount ?? 0,
    orderCount: orderCount ?? 0,
  };
}

export async function getSellerProducts() {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = createServerClient();
  const { data } = await supabase
    .from('products')
    .select('*, categories( name )')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  return data ?? [];
}

export async function getSellerProductById(id: number) {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createServerClient();
  const { data } = await supabase
    .from('products')
    .select('*, product_images ( url, sort_order )')
    .eq('id', id)
    .eq('seller_id', user.id)
    .maybeSingle();

  return data ?? null;
}
