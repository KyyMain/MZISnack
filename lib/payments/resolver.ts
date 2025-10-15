import { cache } from 'react';
import { FakeGateway } from '@/lib/payments/fake';
import { MidtransGateway } from '@/lib/payments/midtrans';
import type { PaymentGateway } from '@/lib/payments/types';

export const getPaymentGateway = cache((): PaymentGateway => {
  const driver = process.env.PAYMENT_DRIVER ?? 'fake';
  if (driver === 'midtrans') {
    return new MidtransGateway();
  }
  return new FakeGateway();
});
