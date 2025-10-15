import { NextResponse } from 'next/server';
import { checkoutOrder } from '@/app/(site)/checkout/server-actions';

export async function POST(request: Request) {
  const body = await request.json();
  const result = await checkoutOrder({
    addressId: Number(body.addressId),
    notes: body.notes,
  });

  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Berhasil', redirectUrl: result.redirectUrl });
}
