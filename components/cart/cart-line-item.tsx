import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { QuantityInput } from '@/components/product/quantity-input';
import { formatCurrency } from '@/lib/utils';

type CartLineItemProps = {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  qty: number;
  price: number;
  stock: number;
  onUpdate: (nextQty: number) => void;
  onRemove: () => void;
};

export function CartLineItem({
  name,
  slug,
  image,
  qty,
  price,
  stock,
  onUpdate,
  onRemove,
}: CartLineItemProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-slate-100">
          {image ? (
            <Image src={image} alt={name} fill className="object-cover" sizes="80px" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Tanpa Gambar
            </div>
          )}
        </div>
        <div>
          <Link href={`/p/${slug}`} className="text-sm font-semibold text-slate-900 hover:text-primary">
            {name}
          </Link>
          <p className="text-xs text-slate-500">Stok: {stock}</p>
          <p className="text-sm font-semibold text-primary">{formatCurrency(price)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <QuantityInput value={qty} max={stock} onChange={onUpdate} />
        <Button variant="ghost" onClick={onRemove} className="text-sm text-rose-600">
          Hapus
        </Button>
      </div>
    </div>
  );
}
