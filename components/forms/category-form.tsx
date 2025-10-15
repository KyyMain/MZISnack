'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryInput } from '@/lib/validators/category';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type Props = {
  defaultValues?: Partial<CategoryInput>;
  onSubmit: (values: CategoryInput) => Promise<void> | void;
};

export function CategoryForm({ defaultValues, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      ...defaultValues,
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values, event) => {
        event?.preventDefault();
        await onSubmit(values);
      })}
    >
      <div>
        <Label htmlFor="name">Nama Kategori</Label>
        <Input id="name" placeholder="Makanan Ringan" {...register('name')} />
        {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" placeholder="makanan-ringan" {...register('slug')} />
        {errors.slug ? <p className="mt-1 text-xs text-rose-600">{errors.slug.message}</p> : null}
      </div>
      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" rows={3} {...register('description')} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Menyimpan...' : 'Simpan Kategori'}
      </Button>
    </form>
  );
}
