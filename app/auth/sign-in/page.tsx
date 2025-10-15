import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { signIn } from '@/app/(auth)/server-actions';

export default function SignInPage() {
  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Masuk</h1>
        <p className="text-sm text-slate-600">
          Gunakan email dan kata sandi Anda untuk mengelola pesanan dan belanja.
        </p>
      </div>
      <div className="mt-6">
        <AuthForm mode="sign-in" onSubmit={signIn} />
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        Belum punya akun?{' '}
        <Link href="/auth/sign-up" className="font-semibold text-primary hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
