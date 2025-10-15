import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { requireAuth } from '@/lib/auth/guards';
import { getOrderDetail } from '@/lib/orders/queries';
import { formatCurrency } from '@/lib/utils';
import { PrintReceiptButton } from '@/components/orders/print-receipt-button';

type Props = {
  params: { code: string };
};

export default async function OrderReceiptPage({ params }: Props) {
  await requireAuth();
  const order = await getOrderDetail(params.code);
  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl bg-white p-8 text-slate-800 print:p-0">
      <header className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Struk Pembelian</h1>
          <p className="text-sm text-slate-500">
            Kode Pesanan: <span className="font-semibold text-slate-900">{order.code}</span>
          </p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <p>
            Tanggal:{' '}
            {format(new Date(order.created_at), 'd MMM yyyy HH:mm', {
              locale: localeId,
            })}
          </p>
          <p>Metode: {order.payment_driver === 'midtrans' ? 'Midtrans Snap' : 'Pembayaran Simulasi'}</p>
        </div>
      </header>

      <section className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-6 text-sm text-slate-600 print:bg-white print:border print:border-slate-200">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Pembeli</h2>
          <p>{order.buyer?.name ?? 'Pembeli'}</p>
          <p className="text-xs text-slate-500">ID: {order.buyer?.id ?? '-'}</p>
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">Penjual</h2>
          <p>{order.seller?.name ?? 'Penjual'}</p>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-base font-semibold text-slate-900">Detail Produk</h2>
        <table className="mt-3 w-full overflow-hidden rounded-xl border border-slate-200 text-sm">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2">Produk</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Harga</th>
              <th className="px-4 py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {order.order_items?.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 text-slate-700">{item.product_name_snapshot}</td>
                <td className="px-4 py-3 text-slate-600">{item.qty}</td>
                <td className="px-4 py-3 text-slate-600">{formatCurrency(item.price)}</td>
                <td className="px-4 py-3 text-right text-slate-700 font-semibold">
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex flex-col items-end gap-1">
          <div className="flex w-full max-w-xs items-center justify-between text-sm text-slate-600">
            <span>Total Produk</span>
            <span>{order.order_items?.reduce((acc, item) => acc + item.qty, 0) ?? 0}</span>
          </div>
          <div className="flex w-full max-w-xs items-center justify-between text-base font-semibold text-slate-900">
            <span>Total Pembayaran</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
        </div>
      </section>

      <footer className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p>Terima kasih telah berbelanja di MZI Snack.</p>
        <div className="print:hidden">
          <PrintReceiptButton />
        </div>
      </footer>
    </div>
  );
}
