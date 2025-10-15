import { getActiveCategories } from '@/lib/products/queries';
import { ProductForm } from '@/components/forms/product-form';
import { createProduct } from '@/app/seller/products/server-actions';

export default async function SellerProductCreatePage() {
  const categories = await getActiveCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tambah Produk</h1>
        <p className="text-sm text-slate-600">Lengkapi detail produk untuk ditampilkan di toko.</p>
      </div>
      <ProductForm categories={categories} onSubmit={createProduct} submittingText="Menyimpan..." />
    </div>
  );
}
