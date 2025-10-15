import { getAdminStats } from '@/lib/admin/queries';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Ringkasan Admin</h1>
        <p className="text-sm text-slate-600">Pantau kategori dan kelola peran pengguna.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total Kategori</p>
          <p className="text-2xl font-semibold text-slate-900">{stats.categoryCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total Penjual</p>
          <p className="text-2xl font-semibold text-slate-900">{stats.sellerCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Total Pembeli</p>
          <p className="text-2xl font-semibold text-slate-900">{stats.buyerCount}</p>
        </div>
      </div>
    </div>
  );
}
