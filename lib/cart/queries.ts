import { cache } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import type { Tables } from '@/lib/supabase/database.types';

export const getCartSummary = cache(async () => {
  const user = await getCurrentUser();
  if (!user) {
    return { totalItems: 0 };
  }

  const supabase = createServerClient();
  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!cart) {
    return { totalItems: 0 };
  }

  const { data: items } = await supabase
    .from('cart_items')
    .select('qty')
    .eq('cart_id', cart.id);

  const totalItems = items?.reduce((acc, item) => acc + item.qty, 0) ?? 0;
  return { totalItems };
});

export async function getCartWithItems() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const supabase = createServerClient();
  const { data: cart } = await supabase
    .from('carts')
    .select('id, updated_at, cart_items ( id, product_id, qty, price_snapshot, products ( name, slug, stock, seller_id, product_images ( url, sort_order ) ) )')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .maybeSingle();

  if (!cart) return null;

  return cart as Tables<'carts'> & {
    cart_items: Array<
      Tables<'cart_items'> & {
        products: Tables<'products'> & {
          product_images: { url: string; sort_order: number | null }[];
        };
      }
    >;
  };
}
