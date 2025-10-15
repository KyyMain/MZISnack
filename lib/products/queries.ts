import { cache } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';

export const getActiveCategories = cache(async () => {
  const supabase = createServerClient();
  const { data } = await supabase.from('categories').select('*').order('name', { ascending: true });
  return data ?? [];
});

export const getFeaturedProducts = cache(async () => {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('products')
    .select('*, product_images ( url, sort_order ), categories ( name, slug )')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(12);
  return data ?? [];
});

export async function searchProducts(params: { categorySlug?: string; query?: string }) {
  const supabase = createServerClient();
  let query = supabase
    .from('products')
    .select('*, product_images ( url, sort_order ), categories ( name, slug )')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (params.categorySlug) {
    query = query.eq('categories.slug', params.categorySlug);
  }

  if (params.query) {
    query = query.ilike('name', `%${params.query}%`);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getProductBySlug(slug: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from('products')
    .select('*, product_images ( url, sort_order ), categories ( id, name, slug )')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  return data ?? null;
}
