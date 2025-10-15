export type PaymentInit = {
  token?: string;
  redirect_url?: string;
};

export type PaymentWebhookResult = {
  code: string;
  newStatus: 'paid' | 'cancelled' | 'awaiting_payment';
  reference?: string | null;
  meta?: Record<string, unknown>;
};

export interface PaymentGateway {
  initiate(orderId: string): Promise<PaymentInit>;
  webhook(request: Request): Promise<PaymentWebhookResult>;
}

export type OrderWithRelations = {
  id: string;
  code: string;
  buyer_id: string;
  seller_id: string;
  total_amount: number;
  shipping_cost: number;
  payment_driver: string;
  payment_ref: string | null;
};
