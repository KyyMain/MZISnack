import Link from 'next/link';
import Image from 'next/image';
import type { Tables } from '@/lib/supabase/database.types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type ProductWithRelations = Tables<'products'> & {
  product_images?: { url: string; sort_order: number | null }[];
  categories?: { name: string; slug: string | null } | null;
};

type Props = {
  product: ProductWithRelations;
};

export function ProductCard({ product }: Props) {
  const cover = product.product_images?.[0]?.url;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link href={`/p/${product.slug}`} className="relative block aspect-square bg-slate-100">
        {cover ? (
          <Image
            src={cover}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Tanpa Gambar
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 px-4 py-4">
        {product.categories?.name ? (
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {product.categories.name}
          </span>
        ) : null}
        <Link href={`/p/${product.slug}`} className="text-base font-semibold text-slate-900">
          {product.name}
        </Link>
        <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-semibold text-primary">{formatCurrency(product.price)}</span>
          <Button asChild>
            <Link href={`/p/${product.slug}`}>Lihat</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
