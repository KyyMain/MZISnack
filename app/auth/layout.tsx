import Link from 'next/link';
import { Store } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Store className="h-6 w-6 text-primary" aria-hidden />
            <span>MZI Snack</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-10">{children}</main>
    </div>
  );
}
