import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">Halaman tidak ditemukan</h1>
      <p className="max-w-md text-sm text-slate-600">
        Maaf, kami tidak dapat menemukan halaman yang Anda cari. Silakan kembali ke beranda atau cari produk lainnya.
      </p>
      <Link href="/" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
