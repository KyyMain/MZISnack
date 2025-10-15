import { cookies } from 'next/headers';
import {
  createServerComponentClient as createSupabaseServerComponentClient,
  createServerActionClient as createSupabaseServerActionClient,
  createRouteHandlerClient as createSupabaseRouteHandlerClient,
} from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase/database.types';

export function createServerClient() {
  const cookieStore = cookies();
  return createSupabaseServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
}

export function createServerActionClient() {
  const cookieStore = cookies();
  return createSupabaseServerActionClient<Database>({
    cookies: () => cookieStore,
  });
}

export function createRouteHandlerClient() {
  const cookieStore = cookies();
  return createSupabaseRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
}
