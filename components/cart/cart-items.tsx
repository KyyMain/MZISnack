'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { CartLineItem } from '@/components/cart/cart-line-item';

export type CartItemView = {
  id: number;
  productId: number;
  name: string;
  slug: string;
  image?: string | null;
  qty: number;
  price: number;
  stock: number;
};

type UpdateAction = (payload: { itemId: number; qty: number }) => Promise<{
  success: boolean;
  message?: string;
}>;

type RemoveAction = (payload: { itemId: number }) => Promise<{
  success: boolean;
  message?: string;
}>;

type Props = {
  items: CartItemView[];
  onUpdate: UpdateAction;
  onRemove: RemoveAction;
};

export function CartItems({ items, onUpdate, onRemove }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartLineItem
          key={item.id}
          id={item.id}
          name={item.name}
          slug={item.slug}
          image={item.image}
          qty={item.qty}
          price={item.price}
          stock={item.stock}
          onUpdate={(qty) =>
            startTransition(async () => {
              const result = await onUpdate({ itemId: item.id, qty });
              if (!result.success) {
                toast.error(result.message ?? 'Tidak dapat memperbarui keranjang');
              }
            })
          }
          onRemove={() =>
            startTransition(async () => {
              const result = await onRemove({ itemId: item.id });
              if (!result.success) {
                toast.error(result.message ?? 'Tidak dapat menghapus item');
              } else {
                toast.success('Item dihapus dari keranjang');
              }
            })
          }
        />
      ))}
      {pending ? <p className="text-sm text-slate-500">Memproses...</p> : null}
    </div>
  );
}
