import { createServerClient } from '@/lib/supabase/server';

export async function getAllCategories() {
  const supabase = createServerClient();
  const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
  return data ?? [];
}

export async function getAllUsers() {
  const supabase = createServerClient();
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return data ?? [];
}

export async function getAdminStats() {
  const supabase = createServerClient();

  const [{ count: categoryCount }, { count: sellerCount }, { count: buyerCount }] = await Promise.all([
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'seller'),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'buyer'),
  ]);

  return {
    categoryCount: categoryCount ?? 0,
    sellerCount: sellerCount ?? 0,
    buyerCount: buyerCount ?? 0,
  };
}
