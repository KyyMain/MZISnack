import { NextResponse } from 'next/server';
import { updateCartItem } from '@/app/(site)/cart/server-actions';

export async function PATCH(request: Request) {
  const body = await request.json();
  const result = await updateCartItem({
    itemId: Number(body.itemId),
    qty: Number(body.qty),
  });

  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Berhasil' });
}
