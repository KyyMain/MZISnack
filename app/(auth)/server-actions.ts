'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from '@/lib/validators/auth';
import { createServerActionClient } from '@/lib/supabase/server';

export async function signIn(values: SignInInput) {
  const parsed = signInSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Data tidak valid' };
  }

  const supabase = createServerActionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signUp(values: SignUpInput) {
  const parsed = signUpSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? 'Data tidak valid' };
  }

  const supabase = createServerActionClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/sign-in`,
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: 'Periksa email Anda untuk konfirmasi.',
  };
}

export async function signOut() {
  const supabase = createServerActionClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
