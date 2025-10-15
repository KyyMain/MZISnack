import Link from 'next/link';
import { getCartWithItems } from '@/lib/cart/queries';
import { CartItems } from '@/components/cart/cart-items';
import { CartSummary } from '@/components/cart/cart-summary';
import { updateCartItem, removeCartItem } from '@/app/(site)/cart/server-actions';

export default async function CartPage() {
  const cart = await getCartWithItems();

  if (!cart || cart.cart_items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Keranjang Kosong</h1>
        <p className="text-sm text-slate-600">Mulai belanja dan dukung produk UMKM lokal.</p>
        <Link
          href="/"
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Belanja Sekarang
        </Link>
      </div>
    );
  }

  const items = cart.cart_items.map((item) => ({
    id: item.id,
    productId: item.product_id,
    name: item.products.name,
    slug: item.products.slug,
    image: item.products.product_images?.[0]?.url ?? null,
    qty: item.qty,
    price: item.price_snapshot,
    stock: item.products.stock,
  }));

  const totals = items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.qty,
      totalAmount: acc.totalAmount + item.qty * item.price,
    }),
    { totalItems: 0, totalAmount: 0 },
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900">Keranjang Belanja</h1>
        <p className="text-sm text-slate-600">
          Pastikan stok mencukupi sebelum melanjutkan ke checkout.
        </p>
        <div className="mt-6">
          <CartItems items={items} onUpdate={updateCartItem} onRemove={removeCartItem} />
        </div>
      </section>

      <aside>
        <CartSummary
          totalItems={totals.totalItems}
          totalAmount={totals.totalAmount}
          checkoutHref="/checkout"
          checkoutLabel="Lanjut ke Checkout"
        />
      </aside>
    </div>
  );
}
