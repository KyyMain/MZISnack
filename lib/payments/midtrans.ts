import crypto from 'node:crypto';
import { getOrderByCode } from '@/lib/payments/shared';
import type { PaymentGateway, PaymentInit, PaymentWebhookResult } from '@/lib/payments/types';

const SANDBOX_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions';
const PRODUCTION_URL = 'https://app.midtrans.com/snap/v1/transactions';

const STATUS_MAP: Record<string, PaymentWebhookResult['newStatus']> = {
  settlement: 'paid',
  capture: 'paid',
  pending: 'awaiting_payment',
  deny: 'cancelled',
  cancel: 'cancelled',
  expire: 'cancelled',
};

function getEndpoint() {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
  return isProduction ? PRODUCTION_URL : SANDBOX_URL;
}

export class MidtransGateway implements PaymentGateway {
  private readonly serverKey = process.env.MIDTRANS_SERVER_KEY ?? '';

  private getAuthHeader() {
    const credential = Buffer.from(`${this.serverKey}:`).toString('base64');
    return `Basic ${credential}`;
  }

  async initiate(orderCode: string): Promise<PaymentInit> {
    if (!this.serverKey) {
      throw new Error('MIDTRANS_SERVER_KEY belum dikonfigurasi');
    }

    const order = await getOrderByCode(orderCode);
    const body = {
      transaction_details: {
        order_id: order.code,
        gross_amount: order.total_amount,
      },
      customer_details: {
        first_name: order.buyer.name,
        email: order.buyer.email,
        phone: order.buyer.phone,
      },
      item_details: order.items.map((item) => ({
        id: item.product_id,
        price: item.price,
        quantity: item.qty,
        name: item.product_name_snapshot,
      })),
    };

    const response = await fetch(getEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.getAuthHeader(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const payload = await response.text();
      throw new Error(`Midtrans Snap error: ${payload}`);
    }

    const payload = await response.json();

    return {
      token: payload.token,
      redirect_url: payload.redirect_url,
    };
  }

  async webhook(request: Request): Promise<PaymentWebhookResult> {
    if (!this.serverKey) {
      throw new Error('MIDTRANS_SERVER_KEY belum dikonfigurasi');
    }

    const payload = await request.json();
    const signature = request.headers.get('x-callback-signature');
    const orderId = String(payload.order_id ?? '');
    const status = String(payload.transaction_status ?? 'pending');
    const statusCode = String(payload.status_code ?? '');
    const grossAmount = String(payload.gross_amount ?? '');

    const expectedSignature = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${this.serverKey}`)
      .digest('hex');

    if (!signature || expectedSignature !== signature) {
      throw new Error('Signature webhook Midtrans tidak valid');
    }

    return {
      code: orderId,
      newStatus: STATUS_MAP[status] ?? 'awaiting_payment',
      reference: payload.transaction_id ?? null,
      meta: payload,
    };
  }
}
