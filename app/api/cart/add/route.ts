import { NextResponse } from 'next/server';
import { addToCart } from '@/app/(site)/p/[slug]/server-actions';

export async function POST(request: Request) {
  const body = await request.json();
  const result = await addToCart({
    productId: Number(body.productId),
    qty: Number(body.qty),
  });

  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Berhasil' });
}
