import { searchProducts, getActiveCategories } from '@/lib/products/queries';
import { ProductGrid } from '@/components/product/product-grid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
  searchParams: { q?: string; category?: string };
};

export default async function SearchPage({ searchParams }: Props) {
  const [categories, products] = await Promise.all([
    getActiveCategories(),
    searchProducts({
      query: searchParams.q,
      categorySlug: searchParams.category,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Pencarian Produk</h1>
        <p className="text-sm text-slate-600">
          Temukan produk UMKM sesuai kebutuhan Anda.
        </p>
      </div>

      <form className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr,240px,120px]" action="/search">
        <Input name="q" placeholder="Cari produk..." defaultValue={searchParams.q} />
        <select
          name="category"
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          defaultValue={searchParams.category}
        >
          <option value="">Semua kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <Button type="submit">Cari</Button>
      </form>

      <ProductGrid products={products} />
    </div>
  );
}
