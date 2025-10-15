import Link from 'next/link';
import { Package, ClipboardList } from 'lucide-react';
import { getSellerStats } from '@/lib/seller/queries';

export default async function SellerDashboardPage() {
  const stats = await getSellerStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Ringkasan Penjual</h1>
        <p className="text-sm text-slate-600">
          Kelola katalog produk dan pantau pesanan dari pelanggan.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="text-sm text-slate-500">Total Produk Aktif</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.productCount}</p>
          </div>
          <Package className="h-10 w-10 text-primary" aria-hidden />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <p className="text-sm text-slate-500">Total Pesanan</p>
            <p className="text-2xl font-semibold text-slate-900">{stats.orderCount}</p>
          </div>
          <ClipboardList className="h-10 w-10 text-primary" aria-hidden />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Langkah Cepat</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link
            href="/seller/products/new"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-medium text-white"
          >
            Tambah Produk
          </Link>
          <Link
            href="/seller/products"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:border-primary hover:text-primary"
          >
            Kelola Produk
          </Link>
          <Link
            href="/seller/orders"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:border-primary hover:text-primary"
          >
            Lihat Pesanan
          </Link>
        </div>
      </div>
    </div>
  );
}
