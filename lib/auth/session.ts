import type { Session } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/supabase/database.types';

export async function getSession(): Promise<Session | null> {
  const supabase = createServerClient();
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function getCurrentUser() {
  const supabase = createServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getProfile(): Promise<Tables<'profiles'> | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = createServerClient();
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return data ?? null;
}
