export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} MZI Snack. Semua hak dilindungi.</p>
        <p className="text-xs">
          Dibangun untuk UMKM. Bayar aman dengan Midtrans atau mode percobaan.
        </p>
      </div>
    </footer>
  );
}
