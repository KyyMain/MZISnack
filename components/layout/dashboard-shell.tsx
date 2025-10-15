import Link from 'next/link';

type NavLink = {
  href: string;
  label: string;
};

type DashboardShellProps = {
  title: string;
  description?: string;
  links: NavLink[];
  children: React.ReactNode;
};

export function DashboardShell({ title, description, links, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            {description ? <p className="text-sm text-slate-500">{description}</p> : null}
          </div>
          <Link href="/" className="text-sm text-primary hover:underline">
            &larr; Kembali ke Toko
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:flex-row">
        <aside className="w-full rounded-lg border border-slate-200 bg-white p-4 md:w-64">
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}
