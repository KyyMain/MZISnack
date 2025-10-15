import { getOrderByCode } from '@/lib/payments/shared';
import type { PaymentGateway, PaymentInit, PaymentWebhookResult } from '@/lib/payments/types';

const STATUS_MAP: Record<string, PaymentWebhookResult['newStatus']> = {
  settlement: 'paid',
  capture: 'paid',
  deny: 'cancelled',
  cancel: 'cancelled',
  expire: 'cancelled',
  pending: 'awaiting_payment',
};

export class FakeGateway implements PaymentGateway {
  async initiate(orderId: string): Promise<PaymentInit> {
    const order = await getOrderByCode(orderId);
    return {
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payments/fake/pay?code=${order.code}`,
    };
  }

  async webhook(request: Request): Promise<PaymentWebhookResult> {
    let payload: Record<string, unknown>;
    const contentType = request.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else {
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries());
    }

    const statusRaw = String(payload.status ?? payload.transaction_status ?? 'pending');
    const code = String(payload.code ?? payload.order_id ?? '');
    const newStatus = STATUS_MAP[statusRaw] ?? 'awaiting_payment';

    if (!code) {
      throw new Error('Kode pesanan tidak ditemukan pada payload webhook');
    }

    return {
      code,
      newStatus,
      reference: payload.reference ?? 'fake-webhook',
      meta: payload,
    };
  }
}
