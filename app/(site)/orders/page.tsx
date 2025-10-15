import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { getBuyerOrders } from '@/lib/orders/queries';
import { formatCurrency } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { Table, THead, TR, TH, TBody, TD } from '@/components/ui/table';
import { requireAuth } from '@/lib/auth/guards';

export default async function OrdersPage() {
  await requireAuth();

  const orders = await getBuyerOrders();

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Belum ada pesanan</h1>
        <p className="mt-2 text-sm text-slate-600">
          Mulai belanja produk UMKM favorit Anda dan pantau statusnya di sini.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Pesanan Saya</h1>
        <p className="text-sm text-slate-600">Lihat status dan detail setiap pesanan Anda.</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <Table>
          <THead>
            <TR>
              <TH>Kode</TH>
              <TH>Penjual</TH>
              <TH>Total</TH>
              <TH>Status</TH>
              <TH>Tanggal</TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {orders.map((order) => (
              <TR key={order.id}>
                <TD className="font-semibold text-slate-900">{order.code}</TD>
                <TD>{order.seller?.name ?? 'Penjual'}</TD>
                <TD className="font-semibold text-slate-900">{formatCurrency(order.total_amount)}</TD>
                <TD>
                  <OrderStatusBadge status={order.status as any} />
                </TD>
                <TD className="text-xs text-slate-500">
                  {format(new Date(order.created_at), 'd MMM yyyy HH:mm', { locale: localeId })}
                </TD>
                <TD>
                  <Link href={`/orders/${order.code}`} className="text-sm text-primary hover:underline">
                    Detail
                  </Link>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
