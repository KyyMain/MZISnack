import { ProductCard } from '@/components/product/product-card';

type Props<T> = {
  products: T[];
};

export function ProductGrid<T extends { id: number; slug: string }>({ products }: Props<T>) {
  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500">
        Produk belum tersedia.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product as any} />
      ))}
    </div>
  );
}
