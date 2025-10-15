import { revalidatePath } from 'next/cache';
import { getServiceClient } from '@/lib/supabase/service';
import type { PaymentWebhookResult } from '@/lib/payments/types';

export async function applyPaymentResult(result: PaymentWebhookResult) {
  const client = getServiceClient();

  const { data: order, error } = await client
    .from('orders')
    .select('id, code, status, payment_driver, payment_ref, order_items ( product_id, qty ), seller_id')
    .eq('code', result.code)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!order) {
    throw new Error('Pesanan tidak ditemukan');
  }

  const nextStatus = result.newStatus;
  const updates: Record<string, unknown> = {
    status: nextStatus,
    payment_ref: result.reference ?? order.payment_ref,
    payment_meta: result.meta ?? null,
  };

  const { error: updateError } = await client.from('orders').update(updates).eq('id', order.id);
  if (updateError) {
    throw updateError;
  }

  if (nextStatus === 'paid') {
    const { data: productStocks, error: stockError } = await client
      .from('products')
      .select('id, stock')
      .in(
        'id',
        order.order_items.map((item) => item.product_id),
      );

    if (stockError) {
      throw stockError;
    }

    const stockMap = new Map(productStocks?.map((product) => [product.id, product.stock]));
    const insufficient = order.order_items.find(
      (item) => (stockMap.get(item.product_id) ?? 0) < item.qty,
    );

    if (insufficient) {
      await client
        .from('orders')
        .update({ status: 'cancelled', payment_meta: { reason: 'stok_kurang' } })
        .eq('id', order.id);
      throw new Error('Stok tidak mencukupi untuk pesanan ini');
    }

    for (const item of order.order_items) {
      await client
        .from('products')
        .update({ stock: (stockMap.get(item.product_id) ?? 0) - item.qty })
        .eq('id', item.product_id);
    }
  }

  revalidatePath('/orders');
  revalidatePath('/seller/orders');
}
