import { NextResponse } from 'next/server';
import { getPaymentGateway } from '@/lib/payments/resolver';

export async function POST(request: Request) {
  if (process.env.PAYMENT_DRIVER !== 'midtrans') {
    return NextResponse.json({ message: 'Driver pembayaran bukan Midtrans.' }, { status: 400 });
  }

  const body = await request.json();
  const code = String(body.code ?? body.orderId ?? '');

  if (!code) {
    return NextResponse.json({ message: 'Kode pesanan wajib diisi.' }, { status: 400 });
  }

  const gateway = getPaymentGateway();
  const init = await gateway.initiate(code);

  return NextResponse.json(init);
}
