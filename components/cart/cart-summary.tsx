import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Props = {
  totalItems: number;
  totalAmount: number;
  checkoutHref?: string;
  checkoutLabel?: string;
};

export function CartSummary({ totalItems, totalAmount, checkoutHref, checkoutLabel }: Props) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Total Produk</span>
        <span className="font-semibold text-slate-900">{totalItems}</span>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Subtotal</span>
        <span className="text-lg font-semibold text-primary">{formatCurrency(totalAmount)}</span>
      </div>
      <Button className="w-full" asChild>
        <Link href={checkoutHref ?? '/checkout'}>
          {checkoutLabel ?? 'Checkout'}
        </Link>
      </Button>
    </div>
  );
}
