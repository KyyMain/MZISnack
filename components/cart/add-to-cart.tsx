'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { QuantityInput } from '@/components/product/quantity-input';

type AddToCartAction = (payload: { productId: number; qty: number }) => Promise<{
  success: boolean;
  message?: string;
}>;

type Props = {
  productId: number;
  stock: number;
  onAdd: AddToCartAction;
};

export function AddToCart({ stock, productId, onAdd }: Props) {
  const [qty, setQty] = useState(1);
  const [pending, startTransition] = useTransition();

  const handleAdd = () => {
    startTransition(async () => {
      const result = await onAdd({ productId, qty });
      if (result.success) {
        toast.success('Produk ditambahkan ke keranjang');
      } else {
        toast.error(result.message ?? 'Gagal menambahkan produk');
        if (result.message?.toLowerCase().includes('masuk')) {
          setTimeout(() => {
            window.location.href = '/auth/sign-in';
          }, 800);
        }
      }
    });
  };

  return (
    <div className="flex items-center gap-4">
      <QuantityInput value={qty} max={stock} onChange={setQty} />
      <Button onClick={handleAdd} disabled={pending || stock < 1}>
        Tambah ke Keranjang
      </Button>
    </div>
  );
}
