'use server';

import { revalidatePath } from 'next/cache';
import { categorySchema, type CategoryInput } from '@/lib/validators/category';
import { getServiceClient } from '@/lib/supabase/service';
import { requireAdmin } from '@/lib/auth/guards';

export async function createCategory(values: CategoryInput) {
  await requireAdmin();

  const parsed = categorySchema.safeParse(values);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Data kategori tidak valid');
  }

  const supabase = getServiceClient();
  const { error } = await supabase.from('categories').insert(parsed.data);

  if (error) {
    throw new Error(error.message ?? 'Gagal menyimpan kategori');
  }

  revalidatePath('/admin/categories');
}
