'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export function QuantityInput({ value, min = 1, max = 99, onChange }: Props) {
  const decrease = () => onChange(Math.max(value - 1, min));
  const increase = () => onChange(Math.min(value + 1, max));

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
      <Button
        type="button"
        variant="ghost"
        onClick={decrease}
        className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center text-sm font-semibold text-slate-700">{value}</span>
      <Button
        type="button"
        variant="ghost"
        onClick={increase}
        className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
