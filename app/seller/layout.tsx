import { requireSeller } from '@/lib/auth/guards';
import { DashboardShell } from '@/components/layout/dashboard-shell';

const links = [
  { href: '/seller', label: 'Ringkasan' },
  { href: '/seller/products', label: 'Produk Saya' },
  { href: '/seller/products/new', label: 'Tambah Produk' },
  { href: '/seller/orders', label: 'Pesanan' },
];

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  await requireSeller();

  return (
    <DashboardShell
      title="Panel Penjual"
      description="Kelola katalog dan pesanan toko Anda."
      links={links}
    >
      {children}
    </DashboardShell>
  );
}
