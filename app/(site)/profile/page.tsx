import { requireAuth } from '@/lib/auth/guards';
import { getUserAddresses } from '@/lib/addresses/queries';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default async function ProfilePage() {
  const profile = await requireAuth();
  const addresses = await getUserAddresses();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Profil Saya</h1>
        <p className="text-sm text-slate-600">Kelola informasi kontak dan alamat pengiriman.</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Informasi Akun</h2>
        <dl className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-500">Nama</dt>
            <dd>{profile.name ?? 'Belum diisi'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Telepon</dt>
            <dd>{profile.phone ?? 'Belum diisi'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Peran</dt>
            <dd>{profile.role === 'seller' ? 'Penjual' : 'Pembeli'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Terdaftar</dt>
            <dd>
              {profile.created_at
                ? format(new Date(profile.created_at), 'dd MMM yyyy', { locale: localeId })
                : 'Tidak diketahui'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Alamat Tersimpan</h2>
        {addresses.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Belum ada alamat yang tersimpan.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {addresses.map((address) => (
              <li key={address.id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">
                    {address.label}{' '}
                    {address.is_default ? (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        Utama
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-slate-500">{address.phone}</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {address.recipient_name} · {address.address_line}, {address.district}, {address.city},{' '}
                  {address.province} {address.postal_code}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
