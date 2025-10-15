'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { addressSchema, type AddressInput } from '@/lib/validators/address';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type Props = {
  defaultValues?: Partial<AddressInput>;
  onSubmit: (values: AddressInput) => Promise<void> | void;
};

export function AddressForm({ defaultValues, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: '',
      recipient_name: '',
      phone: '',
      address_line: '',
      province: '',
      city: '',
      district: '',
      postal_code: '',
      is_default: false,
      ...defaultValues,
    },
  });

  const [pending, startTransition] = useTransition();

  const submit = handleSubmit((values) => {
    startTransition(async () => {
      try {
        await onSubmit(values);
        toast.success('Alamat tersimpan');
      } catch (error) {
        toast.error('Gagal menyimpan alamat');
        console.error(error);
      }
    });
  });

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <div>
        <Label htmlFor="label">Label</Label>
        <Input id="label" placeholder="Rumah / Kantor" {...register('label')} />
        {errors.label ? <p className="mt-1 text-xs text-rose-600">{errors.label.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="recipient_name">Nama Penerima</Label>
        <Input id="recipient_name" {...register('recipient_name')} />
        {errors.recipient_name ? (
          <p className="mt-1 text-xs text-rose-600">{errors.recipient_name.message}</p>
        ) : null}
      </div>
      <div>
        <Label htmlFor="phone">Nomor Telepon</Label>
        <Input id="phone" {...register('phone')} />
        {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="address_line">Alamat Lengkap</Label>
        <Textarea id="address_line" rows={3} {...register('address_line')} />
        {errors.address_line ? (
          <p className="mt-1 text-xs text-rose-600">{errors.address_line.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="province">Provinsi</Label>
          <Input id="province" {...register('province')} />
        </div>
        <div>
          <Label htmlFor="city">Kota/Kabupaten</Label>
          <Input id="city" {...register('city')} />
        </div>
        <div>
          <Label htmlFor="district">Kecamatan</Label>
          <Input id="district" {...register('district')} />
        </div>
        <div>
          <Label htmlFor="postal_code">Kode Pos</Label>
          <Input id="postal_code" {...register('postal_code')} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" {...register('is_default')} />
        Jadikan alamat utama
      </label>

      <Button type="submit" disabled={isSubmitting || pending}>
        {isSubmitting || pending ? 'Menyimpan...' : 'Simpan Alamat'}
      </Button>
    </form>
  );
}
