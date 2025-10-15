import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<string | false | null | undefined>) {
  return twMerge(clsx(inputs));
}

let formatter: Intl.NumberFormat | null = null;

export function formatCurrency(amount: number) {
  if (!formatter) {
    formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: process.env.CURRENCY ?? 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  return formatter.format(amount);
}
