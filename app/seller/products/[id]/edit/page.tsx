import { notFound } from 'next/navigation';
import { getActiveCategories } from '@/lib/products/queries';
import { getSellerProductById } from '@/lib/seller/queries';
import { ProductForm } from '@/components/forms/product-form';
import { updateProduct } from '@/app/seller/products/server-actions';

type Props = {
  params: { id: string };
};

export default async function SellerProductEditPage({ params }: Props) {
  const productId = Number(params.id);
  const [product, categories] = await Promise.all([
    getSellerProductById(productId),
    getActiveCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Ubah Produk</h1>
        <p className="text-sm text-slate-600">
          Perbarui informasi produk untuk memastikan stok dan harga selalu akurat.
        </p>
      </div>
      <ProductForm
        categories={categories}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          description: product.description ?? '',
          category_id: product.category_id ?? undefined,
          price: product.price,
          stock: product.stock,
          is_active: product.is_active,
          images: product.product_images?.map((image) => image.url) ?? [],
        }}
        onSubmit={updateProduct.bind(null, productId)}
        submittingText="Memperbarui..."
      />
    </div>
  );
}
