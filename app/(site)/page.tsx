import Link from 'next/link';
import { Search } from 'lucide-react';
import { getActiveCategories, getFeaturedProducts } from '@/lib/products/queries';
import { ProductGrid } from '@/components/product/product-grid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getActiveCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <div className="space-y-12">
      <section className="grid gap-6 rounded-3xl bg-gradient-to-br from-primary/10 via-white to-white px-6 py-12 md:grid-cols-[1.2fr,0.8fr] md:px-12">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            UMKM Lokal
          </span>
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Belanja produk pilihan UMKM dalam satu tempat.
          </h1>
          <p className="text-sm text-slate-600 md:text-base">
            Temukan makanan ringan, minuman, dan produk kreatif dari pelaku UMKM.
            Dukung usaha lokal dengan transaksi aman dan praktis.
          </p>
          <form action="/search" className="flex gap-2 rounded-full border border-slate-200 bg-white p-2">
            <Search className="h-5 w-5 text-slate-400" aria-hidden />
            <Input
              name="q"
              placeholder="Cari produk UMKM…"
              className="border-none shadow-none focus-visible:ring-0"
            />
            <Button type="submit" variant="primary" className="rounded-full px-6">
              Cari
            </Button>
          </form>
        </div>
        <div className="grid gap-2 rounded-2xl border border-dashed border-slate-200 bg-white/60 p-6 text-sm text-slate-600">
          <h2 className="text-lg font-semibold text-slate-900">Kategori Populer</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/c/${category.slug}`}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <Link href="/c/katalog" className="text-sm font-medium text-primary hover:underline">
            Lihat semua kategori &rarr;
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Produk Terbaru</h2>
          <Link href="/c/katalog" className="text-sm text-primary hover:underline">
            Lihat semua
          </Link>
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
