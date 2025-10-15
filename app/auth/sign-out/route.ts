import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createRouteHandlerClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = createRouteHandlerClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');

  const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? new URL('/', process.env.NEXT_PUBLIC_SITE_URL)
    : new URL('/', 'http://localhost:3000');

  return NextResponse.redirect(redirectUrl);
}
