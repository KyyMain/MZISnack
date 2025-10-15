import { notFound } from 'next/navigation';
import Link from 'next/link';
import { searchProducts, getActiveCategories } from '@/lib/products/queries';
import { ProductGrid } from '@/components/product/product-grid';

type Props = {
  params: { slug: string };
  searchParams: { q?: string };
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const categories = await getActiveCategories();
  const category = categories.find((item) => item.slug === params.slug);

  if (!category && params.slug !== 'katalog') {
    notFound();
  }

  const products = await searchProducts({
    categorySlug: params.slug === 'katalog' ? undefined : params.slug,
    query: searchParams.q,
  });

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          {category ? category.name : 'Semua Produk'}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {category?.description ?? 'Telusuri produk terbaik dari para penjual UMKM.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/c/katalog"
            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-primary hover:text-primary"
          >
            Semua
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/c/${item.slug}`}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-primary hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
