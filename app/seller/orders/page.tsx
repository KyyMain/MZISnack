import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { getSellerOrders } from '@/lib/orders/queries';
import { formatCurrency } from '@/lib/utils';
import { OrderStatusBadge } from '@/components/orders/order-status-badge';
import { Table, THead, TR, TH, TBody, TD } from '@/components/ui/table';

export default async function SellerOrdersPage() {
  const orders = await getSellerOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Pesanan Masuk</h1>
        <p className="text-sm text-slate-600">Pantau dan proses pesanan dari pelanggan.</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <Table>
          <THead>
            <TR>
              <TH>Kode</TH>
              <TH>Pembeli</TH>
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
                <TD>{order.buyer?.name ?? 'Pembeli'}</TD>
                <TD>{formatCurrency(order.total_amount)}</TD>
                <TD>
                  <OrderStatusBadge status={order.status as any} />
                </TD>
                <TD className="text-xs text-slate-500">
                  {format(new Date(order.created_at), 'd MMM yyyy HH:mm', { locale: localeId })}
                </TD>
                <TD>
                  <Link
                    href={`/orders/${order.code}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Detail
                  </Link>
                </TD>
              </TR>
            ))}
            {orders.length === 0 ? (
              <TR>
                <TD colSpan={6} className="py-8 text-center text-sm text-slate-500">
                  Belum ada pesanan.
                </TD>
              </TR>
            ) : null}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
