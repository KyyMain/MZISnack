'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import type { Address } from '@/lib/addresses/queries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type CheckoutItem = {
  name: string;
  qty: number;
  price: number;
  subtotal: number;
};

type Props = {
  addresses: Address[];
  items: CheckoutItem[];
  total: number;
  onSubmit: (payload: { addressId: number; notes?: string }) => Promise<{
    success: boolean;
    message?: string;
    redirectUrl?: string;
  }>;
};

export function CheckoutForm({ addresses, items, total, onSubmit }: Props) {
  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find((addr) => addr.is_default)?.id ?? addresses[0]?.id ?? 0,
  );
  const [notes, setNotes] = useState('');
  const [pending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!selectedAddress) {
      toast.error('Pilih alamat pengiriman terlebih dahulu');
      return;
    }
    startTransition(async () => {
      const result = await onSubmit({ addressId: selectedAddress, notes });
      if (!result.success) {
        toast.error(result.message ?? 'Checkout gagal');
        return;
      }
      toast.success('Pesanan berhasil dibuat, lanjut ke pembayaran');
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Alamat Pengiriman</h2>
        <div className="space-y-3">
          {addresses.map((address) => (
            <label
              key={address.id}
              className="flex cursor-pointer flex-col rounded-lg border border-slate-200 bg-white p-4 hover:border-primary"
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  checked={selectedAddress === address.id}
                  onChange={() => setSelectedAddress(address.id)}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {address.label}{' '}
                    {address.is_default ? (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        Utama
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-slate-500">
                    {address.recipient_name} · {address.phone}
                  </p>
                  <p className="text-xs text-slate-600">
                    {address.address_line}, {address.district}, {address.city}, {address.province},{' '}
                    {address.postal_code}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900">Catatan untuk Penjual</h3>
          <Textarea
            rows={3}
            placeholder="Opsional: contoh - Tolong bungkus rapi ya."
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-base font-semibold text-slate-900">Ringkasan Pesanan</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {items.map((item) => (
              <li key={item.name} className="flex items-center justify-between">
                <span>
                  {item.qty}x {item.name}
                </span>
                <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-semibold text-slate-900">
            <span>Total</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>
        <Button className="w-full" disabled={pending} onClick={handleSubmit}>
          {pending ? 'Memproses...' : 'Bayar Sekarang'}
        </Button>
      </aside>
    </div>
  );
}
