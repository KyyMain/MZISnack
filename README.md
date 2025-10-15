# MZI Snack — E-Commerce UMKM dengan Next.js 14

Platform e-commerce minimalis untuk mendukung pelaku usaha UMKM dengan fitur penjual, pembeli, dan admin. Menggunakan Next.js 14 (App Router), Supabase (Auth/DB/Storage), Tailwind CSS, dan integrasi pembayaran Midtrans Snap dengan driver palsu untuk pengujian lokal.

## Fitur Utama
- Autentikasi Supabase (email/password), profil otomatis dengan peran pembeli/penjual dan flag admin.
- Katalog produk dengan kategori, pencarian, stok dan galeri gambar via Supabase Storage.
- Keranjang tersinkronisasi di database, checkout dengan validasi stok dan pemecahan per penjual.
- Pembayaran menggunakan strategi driver: `fake` untuk lokal, `midtrans` untuk Snap Sandbox/Production.
- Dashboard penjual (produk & pesanan) dan admin (kategori & manajemen pengguna).
- UI mobile-first dengan Tailwind, komponen sederhana, dan copy Bahasa Indonesia.
- Testing setup: Vitest untuk unit, Playwright untuk e2e stub.

## Persiapan Lingkungan
1. **Salin variabel lingkungan**
   ```bash
   cp .env.example .env
   ```
   Lengkapi nilai Supabase, Midtrans, dan domain situs.

2. **Inisialisasi Supabase**
   - Buat project Supabase baru.
   - Eksekusi `supabase/schema.sql` melalui SQL editor atau CLI.
   - Buat bucket storage publik `product-images`.
   - Pastikan `auth.users` trigger terpasang (disediakan pada SQL).

3. **Instalasi dependensi**
   ```bash
   pnpm install
   ```

4. **Jalankan pengembangan**
   ```bash
   pnpm dev
   ```

## Konfigurasi Pembayaran
- **Driver palsu (default):** pastikan `PAYMENT_DRIVER=fake`. Akses halaman simulasi `/payments/fake/pay?code=...` untuk mengirim status webhook.
- **Midtrans Sandbox/Production:**
  1. Set `PAYMENT_DRIVER=midtrans` dan `MIDTRANS_IS_PRODUCTION=false` (sandbox) atau `true` (production).
  2. Isi `MIDTRANS_SERVER_KEY` dan `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` dari dashboard Midtrans.
  3. Tambahkan URL webhook ke Midtrans: `<SITE_URL>/api/payments/midtrans/webhook`.
  4. Gunakan endpoint `POST /api/payments/midtrans/create` untuk memperoleh `token` & `redirect_url` Snap.

## Perintah Umum
- `pnpm dev` – jalankan Next.js lokal.
- `pnpm build && pnpm start` – build produksi dan serve.
- `pnpm lint` – jalankan ESLint.
- `pnpm test` – Vitest unit tests.
- `pnpm test:e2e` – Playwright tests (butuh server jalan & login siap).

## Struktur Direktori Singkat
- `app/` – App Router pages, layouts, route handlers, server actions.
- `components/` – Komponen UI, formulir, layout.
- `lib/` – Utilitas Supabase, pembayaran, auth, validators.
- `supabase/schema.sql` – Definisi database dan kebijakan RLS.
- `tests/` – Unit & e2e stubs.

## Catatan Keamanan & Produksi
- Simpan `SUPABASE_SERVICE_ROLE_KEY` hanya di lingkungan server (Vercel env, dll.).
- Perbarui `NEXT_PUBLIC_SITE_URL` sesuai domain produksi.
- Setel domain gambar (`next.config.mjs`) sesuai sumber CDN.
- Pastikan kebijakan RLS diuji dan hanya admin menggunakan server role untuk operasi sensitif.
- Saat deploy ke Vercel:
  - Set semua variabel `.env` pada dashboard project.
  - Jalankan `pnpm build` untuk memastikan Next.js sukses.
  - Konfigurasi Playwright optional (disable di CI jika belum siap).

## Roadmap / Lanjutan
- Integrasi email notifikasi (Resend/SMTP) saat status pesanan berubah.
- Pengelolaan stok otomatis saat webhook dibanding manual.
- Optimasi gambar (Supabase signed URL atau CDN).
- Penanganan multi-penjual pada checkout (split order).

Selamat membangun dan mendukung UMKM! 💡
