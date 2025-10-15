import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { getSession } from '@/lib/auth/session';
import { Toaster } from '@/components/ui/toaster';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: {
    default: 'MZI Snack | UMKM Commerce',
    template: '%s | MZI Snack',
  },
  description:
    'Platform e-commerce sederhana untuk UMKM dengan dukungan penjual, pembeli, dan admin.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html lang="id" suppressHydrationWarning className={plusJakarta.variable}>
      <body className={`${plusJakarta.className} bg-white text-slate-900 antialiased`}>
        <AppProviders initialSession={session}>{children}</AppProviders>
        <Toaster />
      </body>
    </html>
  );
}
