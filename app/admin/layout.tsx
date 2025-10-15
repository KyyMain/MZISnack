import { requireAdmin } from '@/lib/auth/guards';
import { DashboardShell } from '@/components/layout/dashboard-shell';

const links = [
  { href: '/admin', label: 'Ringkasan' },
  { href: '/admin/categories', label: 'Kategori' },
  { href: '/admin/users', label: 'Pengguna' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <DashboardShell
      title="Panel Admin"
      description="Atur kategori dan peran pengguna."
      links={links}
    >
      {children}
    </DashboardShell>
  );
}
