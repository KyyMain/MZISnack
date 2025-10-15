import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createRouteHandlerClient } from '@/lib/supabase/server';

const MAX_SIZE_BYTES = 1024 * 1024; // 1 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ message: 'File tidak ditemukan' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ message: 'Format gambar harus JPG, PNG, atau WebP.' }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ message: 'Ukuran gambar maksimal 1MB.' }, { status: 400 });
  }

  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `${randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const supabase = createRouteHandlerClient();
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(`products/${fileName}`, bytes, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  const publicUrl = supabase.storage.from('product-images').getPublicUrl(data.path);

  return NextResponse.json({
    path: data.path,
    url: publicUrl.data.publicUrl,
  });
}
