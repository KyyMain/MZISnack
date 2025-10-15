import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { signUp } from '@/app/(auth)/server-actions';

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Daftar</h1>
        <p className="text-sm text-slate-600">
          Buat akun baru dan mulai dukung UMKM favorit Anda.
        </p>
      </div>
      <div className="mt-6">
        <AuthForm mode="sign-up" onSubmit={signUp} />
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        Sudah punya akun?{' '}
        <Link href="/auth/sign-in" className="font-semibold text-primary hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
