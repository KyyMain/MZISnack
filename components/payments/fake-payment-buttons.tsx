'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const STATUSES = [
  { label: 'Berhasil', status: 'settlement', variant: 'primary' as const },
  { label: 'Gagal', status: 'deny', variant: 'outline' as const },
  { label: 'Kedaluwarsa', status: 'expire', variant: 'outline' as const },
];

type Props = {
  code: string;
};

export function FakePaymentButtons({ code }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubmit = async (status: string) => {
    setLoading(status);
    try {
      const response = await fetch('/api/payments/fake/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, status }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        toast.error(result.message ?? 'Gagal mengirim pembaruan pembayaran');
        return;
      }

      if (result.status === 'paid') {
        toast.success('Pembayaran berhasil dikonfirmasi');
        router.push(`/orders/${code}/receipt`);
      } else if (result.status === 'awaiting_payment') {
        toast('Menunggu pembayaran', {
          description: 'Status Midtrans menunggu atau pending',
        });
        router.push(`/orders/${code}`);
      } else {
        toast.error('Pembayaran dibatalkan atau gagal');
        router.push(`/orders/${code}`);
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan jaringan');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      {STATUSES.map((item) => (
        <Button
          key={item.status}
          variant={item.variant}
          disabled={loading !== null}
          onClick={() => handleSubmit(item.status)}
        >
          {loading === item.status ? 'Mengirim...' : item.label}
        </Button>
      ))}
    </div>
  );
}
