import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getProductBySlug } from '@/lib/products/queries';
import { formatCurrency } from '@/lib/utils';
import { AddToCart } from '@/components/cart/add-to-cart';
import { addToCart } from '@/app/(site)/p/[slug]/server-actions';
import { Badge } from '@/components/ui/badge';

type Props = {
  params: { slug: string };
};

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const cover = product.product_images?.[0]?.url;

  return (
    <div className="grid gap-8 md:grid-cols-[1.1fr,0.9fr]">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
          {cover ? (
            <Image
              src={cover}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Gambar belum tersedia
            </div>
          )}
        </div>
        {product.product_images && product.product_images.length > 1 ? (
          <div className="grid grid-cols-4 gap-3">
            {product.product_images.slice(1).map((image) => (
              <div
                key={image.url}
                className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
              >
                <Image src={image.url} alt={product.name} fill className="object-cover" sizes="150px" />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-6">
        <div>
          <Badge>{product.categories?.name ?? 'Kategori Lain'}</Badge>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">{product.name}</h1>
          <p className="mt-2 text-sm text-slate-600">{product.description}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold uppercase text-slate-500">Harga</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</p>
          <p className="mt-2 text-sm text-slate-500">Stok tersedia: {product.stock}</p>
          <div className="mt-6">
            <Suspense fallback={<p className="text-sm text-slate-500">Memuat...</p>}>
              <AddToCart productId={product.id} stock={product.stock} onAdd={addToCart} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
