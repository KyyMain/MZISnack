import { NextResponse } from 'next/server';
import { removeCartItem } from '@/app/(site)/cart/server-actions';

export async function DELETE(request: Request) {
  const body = await request.json();
  const result = await removeCartItem({
    itemId: Number(body.itemId),
  });

  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Berhasil' });
}
