import { getAllUsers } from '@/lib/admin/queries';
import { UserRoleForm } from '@/components/forms/user-role-form';
import { toggleSellerRole, toggleAdminRole } from '@/app/admin/users/server-actions';

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Pengguna</h1>
        <p className="text-sm text-slate-600">
          Atur hak akses penjual dan admin dari satu tempat.
        </p>
      </div>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-sm font-semibold text-slate-900">{user.name ?? 'Pengguna'}</p>
              <p className="text-xs text-slate-500">{user.phone ?? 'Belum ada telepon'}</p>
              <div className="mt-1 flex gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                  Peran: {user.role}
                </span>
                {user.is_admin ? (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">Admin</span>
                ) : null}
              </div>
            </div>
            <UserRoleForm
              isSeller={user.role === 'seller'}
              isAdmin={user.is_admin}
              onToggleSeller={toggleSellerRole.bind(null, user.id, user.role === 'seller')}
              onToggleAdmin={toggleAdminRole.bind(null, user.id, user.is_admin)}
            />
          </div>
        ))}
        {users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
            Belum ada pengguna.
          </div>
        ) : null}
      </div>
    </div>
  );
}
