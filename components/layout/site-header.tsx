import Link from 'next/link';
import { ShoppingCart, Store, User } from 'lucide-react';
import { getProfile } from '@/lib/auth/session';
import { getCartSummary } from '@/lib/cart/queries';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/c/katalog', label: 'Kategori' },
  { href: '/orders', label: 'Pesanan Saya' },
];

export async function SiteHeader() {
  const profile = await getProfile();
  const { totalItems } = await getCartSummary();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <Store className="h-6 w-6 text-primary" aria-hidden />
          <span>MZI Snack</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className={cn(
              'relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 transition hover:border-primary hover:text-primary',
            )}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden />
            <span>Keranjang</span>
            {totalItems > 0 ? (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
                {totalItems}
              </span>
            ) : null}
          </Link>

          {profile ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
              >
                <User className="h-4 w-4" aria-hidden />
                <span>{profile.name ?? 'Pengguna'}</span>
              </Link>
              {profile.role === 'seller' ? (
                <Link href="/seller" className="text-sm font-medium text-slate-600 hover:text-primary">
                  Kelola Produk
                </Link>
              ) : null}
              {profile.is_admin ? (
                <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-primary">
                  Admin
                </Link>
              ) : null}
              <form action="/auth/sign-out" method="post">
                <Button type="submit" variant="ghost" className="text-sm text-slate-600 hover:text-primary">
                  Keluar
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/sign-in">
                <Button variant="outline" className="text-sm">
                  Masuk
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="text-sm">Daftar</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
