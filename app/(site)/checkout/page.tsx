import { redirect } from 'next/navigation';
import { getCartWithItems } from '@/lib/cart/queries';
import { getUserAddresses } from '@/lib/addresses/queries';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { AddressForm } from '@/components/forms/address-form';
import { createAddress } from '@/app/(site)/checkout/server-actions';
import { checkoutOrder } from '@/app/(site)/checkout/server-actions';

export default async function CheckoutPage() {
  const cart = await getCartWithItems();
  if (!cart || cart.cart_items.length === 0) {
    redirect('/cart');
  }

  const addresses = await getUserAddresses();

  const sellerIds = new Set(cart.cart_items.map((item) => item.products.seller_id));
  if (sellerIds.size > 1) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-amber-300 bg-amber-50 px-6 py-10">
        <h1 className="text-2xl font-semibold text-amber-900">Pisahkan pesanan per penjual</h1>
        <p className="mt-2 text-sm text-amber-800">
          Keranjang Anda berisi produk dari lebih dari satu penjual. Untuk saat ini, silakan selesaikan
          pesanan per penjual agar pengelolaan stok lebih mudah.
        </p>
        <p className="mt-4 text-sm text-amber-800">
          Kembali ke <a href="/cart" className="font-semibold underline">keranjang</a> untuk memisahkan
          pesanan.
        </p>
      </div>
    );
  }

  const items = cart.cart_items.map((item) => ({
    name: item.products.name,
    qty: item.qty,
    price: item.price_snapshot,
    subtotal: item.price_snapshot * item.qty,
  }));

  const total = items.reduce((acc, item) => acc + item.subtotal, 0);

  if (addresses.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-slate-200 bg-white px-6 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">Tambah Alamat Pengiriman</h1>
        <p className="text-sm text-slate-600">
          Anda perlu menambahkan setidaknya satu alamat sebelum melanjutkan checkout.
        </p>
        <AddressForm onSubmit={createAddress} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
      <p className="text-sm text-slate-600">
        Periksa kembali alamat dan ringkasan pesanan Anda sebelum melanjutkan ke pembayaran.
      </p>
      <CheckoutForm addresses={addresses} items={items} total={total} onSubmit={checkoutOrder} />
    </div>
  );
}
