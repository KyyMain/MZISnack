export const ORDER_STATUS: Record<
  'pending' | 'awaiting_payment' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled',
  { label: string; description: string }
> = {
  pending: { label: 'Menunggu', description: 'Pesanan baru dibuat' },
  awaiting_payment: { label: 'Menunggu Pembayaran', description: 'Menunggu konfirmasi pembayaran' },
  paid: { label: 'Terbayar', description: 'Pembayaran berhasil diterima' },
  processing: { label: 'Diproses', description: 'Penjual sedang menyiapkan pesanan' },
  shipped: { label: 'Dikirim', description: 'Pesanan dalam pengiriman' },
  completed: { label: 'Selesai', description: 'Pesanan selesai diterima' },
  cancelled: { label: 'Dibatalkan', description: 'Pesanan dibatalkan' },
};

export const PAYMENT_DRIVERS = {
  fake: 'fake',
  midtrans: 'midtrans',
} as const;
