'use client';

import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const baseStyles =
  'inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500 text-white shadow-lg shadow-blue-500/30 hover:brightness-110',
  secondary:
    'bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/20',
  outline:
    'border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:shadow-sm',
  ghost: 'text-slate-600 hover:bg-slate-100',
  subtle:
    'bg-slate-100 text-slate-700 hover:bg-slate-200',
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  asChild?: boolean;
};

export const Button = forwardRef<any, ButtonProps>(function Button(
  { className, variant = 'primary', type = 'button', asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref}
      {...(asChild ? props : { ...props, type })}
      className={cn(baseStyles, variants[variant], className)}
    />
  );
});
