import { redirect } from 'next/navigation';
import { FakePaymentButtons } from '@/components/payments/fake-payment-buttons';

type Props = {
  searchParams: { code?: string };
};

export default function FakePaymentPage({ searchParams }: Props) {
  const code = searchParams.code;
  if (!code) {
    redirect('/');
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Simulasi Pembayaran</h1>
        <p className="mt-2 text-sm text-slate-600">
          Pesanan <span className="font-semibold text-slate-900">{code}</span>
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Gunakan tombol di bawah untuk mengirim status pembayaran percobaan.
        </p>
      </div>
      <FakePaymentButtons code={code} />
    </div>
  );
}
