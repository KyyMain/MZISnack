import Link from 'next/link';
import { getSellerProducts } from '@/lib/seller/queries';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Table, THead, TR, TH, TBody, TD } from '@/components/ui/table';

export default async function SellerProductsPage() {
  const products = await getSellerProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Produk Saya</h1>
          <p className="text-sm text-slate-600">Kelola katalog yang tampil di toko.</p>
        </div>
        <Button asChild>
          <Link href="/seller/products/new">Tambah Produk</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <Table>
          <THead>
            <TR>
              <TH>Nama</TH>
              <TH>Kategori</TH>
              <TH>Harga</TH>
              <TH>Stok</TH>
              <TH>Status</TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {products.map((product) => (
              <TR key={product.id}>
                <TD className="font-semibold text-slate-900">{product.name}</TD>
                <TD className="text-sm text-slate-500">{product.categories?.name ?? '-'}</TD>
                <TD className="font-semibold text-slate-900">{formatCurrency(product.price)}</TD>
                <TD>{product.stock}</TD>
                <TD>{product.is_active ? 'Aktif' : 'Nonaktif'}</TD>
                <TD>
                  <Link
                    href={`/seller/products/${product.id}/edit`}
                    className="text-sm text-primary hover:underline"
                  >
                    Ubah
                  </Link>
                </TD>
              </TR>
            ))}
            {products.length === 0 ? (
              <TR>
                <TD colSpan={6} className="py-8 text-center text-sm text-slate-500">
                  Belum ada produk. Tambahkan produk pertama Anda.
                </TD>
              </TR>
            ) : null}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
