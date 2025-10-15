import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { getOrderDetail } from '@/lib/orders/queries';
import { formatCurrency } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { OrderTimeline } from '@/components/orders/order-timeline';
import { requireAuth } from '@/lib/auth/guards';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
  params: { code: string };
};

export default async function OrderDetailPage({ params }: Props) {
  await requireAuth();

  const order = await getOrderDetail(params.code);
  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Pesanan #{order.code}</h1>
          <p className="text-sm text-slate-600">
            Dibuat pada{' '}
            {format(new Date(order.created_at), 'd MMM yyyy HH:mm', { locale: localeId })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/orders/${order.code}/receipt`}>
            <Button variant="outline">Lihat Struk</Button>
          </Link>
          <OrderStatusBadge status={order.status as any} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Daftar Produk</h2>
          <ul className="space-y-4 text-sm text-slate-600">
            {order.order_items?.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>
                  {item.qty}x {item.product_name_snapshot}
                </span>
                <span>{formatCurrency(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm font-semibold text-slate-900">
            <span>Total Belanja</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Metode Pembayaran</span>
            <span>{order.payment_driver === 'midtrans' ? 'Midtrans Snap' : 'Pembayaran Simulasi'}</span>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-900">Status Pesanan</h3>
            <OrderTimeline current={order.status as any} />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            <h3 className="text-lg font-semibold text-slate-900">Informasi Penjual</h3>
            <p className="mt-2 font-medium text-slate-900">{order.seller?.name ?? 'Penjual'}</p>
            <p className="text-xs text-slate-500">Hubungi penjual jika ada kendala pengiriman.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
