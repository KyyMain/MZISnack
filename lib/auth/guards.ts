import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth/session';

export async function requireAuth(options?: { redirectTo?: string }) {
  const profile = await getProfile();
  if (!profile) {
    redirect(options?.redirectTo ?? '/auth/sign-in');
  }
  return profile;
}

export async function requireSeller() {
  const profile = await requireAuth({ redirectTo: '/auth/sign-in' });
  if (profile.role !== 'seller') {
    redirect('/');
  }
  return profile;
}

export async function requireAdmin() {
  const profile = await requireAuth({ redirectTo: '/auth/sign-in' });
  if (!profile.is_admin) {
    redirect('/');
  }
  return profile;
}
