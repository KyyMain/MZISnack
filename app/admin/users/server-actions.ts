'use server';

import { revalidatePath } from 'next/cache';
import { getServiceClient } from '@/lib/supabase/service';
import { requireAdmin } from '@/lib/auth/guards';

export async function toggleSellerRole(userId: string, isSeller: boolean) {
  await requireAdmin();

  const supabase = getServiceClient();
  const { error } = await supabase
    .from('profiles')
    .update({ role: isSeller ? 'buyer' : 'seller' })
    .eq('id', userId);

  if (error) {
    throw new Error(error.message ?? 'Gagal memperbarui peran penjual');
  }

  revalidatePath('/admin/users');
}

export async function toggleAdminRole(userId: string, isAdmin: boolean) {
  await requireAdmin();

  const supabase = getServiceClient();
  const { error } = await supabase.from('profiles').update({ is_admin: !isAdmin }).eq('id', userId);

  if (error) {
    throw new Error(error.message ?? 'Gagal memperbarui status admin');
  }

  revalidatePath('/admin/users');
}
