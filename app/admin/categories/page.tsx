import { getAllCategories } from '@/lib/admin/queries';
import { CategoryForm } from '@/components/forms/category-form';
import { createCategory } from '@/app/admin/categories/server-actions';

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Kategori</h1>
          <p className="text-sm text-slate-600">
            Kategori membantu pembeli menemukan produk dengan lebih cepat.
          </p>
        </div>
        <ul className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{category.name}</p>
                <p className="text-xs text-slate-500">{category.slug}</p>
                {category.description ? (
                  <p className="text-xs text-slate-500">{category.description}</p>
                ) : null}
              </div>
            </li>
          ))}
          {categories.length === 0 ? (
            <li className="py-6 text-center text-sm text-slate-500">Belum ada kategori.</li>
          ) : null}
        </ul>
      </section>

      <aside className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Tambah Kategori</h2>
        <p className="text-xs text-slate-500">
          Kategori baru akan langsung tersedia bagi semua penjual.
        </p>
        <div className="mt-4">
          <CategoryForm onSubmit={createCategory} />
        </div>
      </aside>
    </div>
  );
}
