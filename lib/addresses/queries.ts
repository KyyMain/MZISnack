import { createServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/session';
import type { Tables } from '@/lib/supabase/database.types';

export async function getUserAddresses() {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = createServerClient();
  const { data } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  return data ?? [];
}

export type Address = Tables<'addresses'>;
