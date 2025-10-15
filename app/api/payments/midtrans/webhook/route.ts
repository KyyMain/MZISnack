import { NextResponse } from 'next/server';
import { getPaymentGateway } from '@/lib/payments/resolver';
import { applyPaymentResult } from '@/lib/orders/mutations';

export async function POST(request: Request) {
  const gateway = getPaymentGateway();
  const result = await gateway.webhook(request);
  await applyPaymentResult(result);
  return NextResponse.json({ success: true });
}
