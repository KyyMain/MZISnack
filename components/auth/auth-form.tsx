'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from '@/lib/validators/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type SignInAction = (payload: SignInInput) => Promise<{ success: boolean; message?: string }>;
type SignUpAction = (payload: SignUpInput) => Promise<{ success: boolean; message?: string }>;

type Props =
  | { mode: 'sign-in'; onSubmit: SignInAction }
  | { mode: 'sign-up'; onSubmit: SignUpAction };

export function AuthForm(props: Props) {
  const [pending, startTransition] = useTransition();
  const isSignIn = props.mode === 'sign-in';

  const form = useForm<SignInInput | SignUpInput>({
    resolver: zodResolver(isSignIn ? signInSchema : signUpSchema),
    defaultValues: isSignIn
      ? { email: '', password: '' }
      : { email: '', password: '', name: '' },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await props.onSubmit(values as any);
      if (!result.success) {
        toast.error(result.message ?? 'Terjadi kesalahan');
        return;
      }
      toast.success(isSignIn ? 'Selamat datang kembali!' : 'Akun berhasil dibuat, cek email Anda');
      if (!isSignIn) {
        setTimeout(() => {
          window.location.href = '/auth/sign-in';
        }, 1200);
      }
    });
  });

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {!isSignIn ? (
        <div>
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input id="name" {...form.register('name' as any)} />
          {form.formState.errors.name ? (
            <p className="mt-1 text-xs text-rose-600">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
      ) : null}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register('email')} />
        {form.formState.errors.email ? (
          <p className="mt-1 text-xs text-rose-600">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <div>
        <Label htmlFor="password">Kata Sandi</Label>
        <Input id="password" type="password" {...form.register('password')} />
        {form.formState.errors.password ? (
          <p className="mt-1 text-xs text-rose-600">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Memproses...' : isSignIn ? 'Masuk' : 'Daftar'}
      </Button>
    </form>
  );
}
