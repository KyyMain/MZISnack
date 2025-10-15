'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Tables } from '@/lib/supabase/database.types';
import { productSchema, type ProductInput } from '@/lib/validators/product';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Props = {
  categories: Tables<'categories'>[];
  defaultValues?: Partial<ProductInput>;
  onSubmit: (values: ProductInput) => Promise<void> | void;
  submittingText?: string;
};

export function ProductForm({ categories, defaultValues, onSubmit, submittingText }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      category_id: undefined,
      price: 0,
      stock: 0,
      is_active: true,
      images: [],
      ...defaultValues,
    },
  });

  const [imageUrls, setImageUrls] = useState<string[]>(defaultValues?.images ?? []);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    register('images');
  }, [register]);

  useEffect(() => {
    if (defaultValues?.category_id) {
      setValue('category_id', defaultValues.category_id);
    }
  }, [defaultValues?.category_id, setValue]);

  useEffect(() => {
    if (defaultValues?.images) {
      setImageUrls(defaultValues.images);
    }
  }, [defaultValues?.images]);

  useEffect(() => {
    setValue('images', imageUrls, { shouldValidate: true });
  }, [imageUrls, setValue]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Format harus JPG, PNG, atau WebP.');
      event.target.value = '';
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error('Ukuran maksimal 1MB.');
      event.target.value = '';
      return;
    }

    const body = new FormData();
    body.append('file', file);

    setUploading(true);
    const response = await fetch('/api/uploads/product', {
      method: 'POST',
      body,
    });
    setUploading(false);
    event.target.value = '';

    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.message ?? 'Gagal mengunggah gambar.');
      return;
    }

    setImageUrls((prev) => {
      const next = [...prev, payload.url as string];
      setValue('images', next, { shouldValidate: true });
      return next;
    });
    toast.success('Gambar berhasil diunggah');
  };

  const handleRemoveImage = (url: string) => {
    setImageUrls((prev) => {
      const next = prev.filter((item) => item !== url);
      setValue('images', next, { shouldValidate: true });
      return next;
    });
  };

  return (
    <form
      className="space-y-5"
      onSubmit={handleSubmit(async (values) => {
        if (imageUrls.length === 0) {
          toast.error('Unggah minimal satu gambar produk.');
          return;
        }

        await onSubmit({
          ...values,
          images: imageUrls,
        });
      })}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Nama Produk</Label>
          <Input id="name" placeholder="Contoh: Keripik Singkong Pedas" {...register('name')} />
          {errors.name ? <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" placeholder="keripik-singkong-pedas" {...register('slug')} />
          {errors.slug ? <p className="mt-1 text-xs text-rose-600">{errors.slug.message}</p> : null}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Jelaskan produk Anda secara singkat"
          {...register('description')}
        />
        {errors.description ? (
          <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label htmlFor="category_id">Kategori</Label>
          <Select id="category_id" {...register('category_id', { valueAsNumber: true })}>
            <option value="">Pilih kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.category_id ? (
            <p className="mt-1 text-xs text-rose-600">{errors.category_id.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="price">Harga (Rp)</Label>
          <Input id="price" type="number" min={0} {...register('price', { valueAsNumber: true })} />
          {errors.price ? <p className="mt-1 text-xs text-rose-600">{errors.price.message}</p> : null}
        </div>
        <div>
          <Label htmlFor="stock">Stok</Label>
          <Input id="stock" type="number" min={0} {...register('stock', { valueAsNumber: true })} />
          {errors.stock ? <p className="mt-1 text-xs text-rose-600">{errors.stock.message}</p> : null}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="is_active" {...register('is_active')} />
        <Label htmlFor="is_active" className="text-sm font-medium text-slate-700">
          Produk aktif dan tampil di toko
        </Label>
      </div>

      <div>
        <Label htmlFor="product-image">Gambar Produk</Label>
        <Input id="product-image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileUpload} />
        <p className="mt-1 text-xs text-slate-500">Format JPG/PNG/WebP, ukuran maksimal 1MB.</p>
        {uploading ? <p className="mt-2 text-xs text-primary">Mengunggah gambar...</p> : null}
        <ul className="mt-3 space-y-2">
          {imageUrls.map((url) => (
            <li
              key={url}
              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-600"
            >
              <span className="mr-3 truncate">{url}</span>
              <Button
                type="button"
                variant="ghost"
                className="text-xs text-rose-600"
                onClick={() => handleRemoveImage(url)}
              >
                Hapus
              </Button>
            </li>
          ))}
        </ul>
        {errors.images ? (
          <p className="mt-1 text-xs text-rose-600">{errors.images.message ?? 'Minimal satu gambar dibutuhkan.'}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting || uploading}>
        {isSubmitting ? submittingText ?? 'Menyimpan...' : 'Simpan Produk'}
      </Button>
    </form>
  );
}
