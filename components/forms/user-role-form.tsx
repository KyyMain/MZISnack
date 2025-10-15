'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Props = {
  isSeller: boolean;
  isAdmin: boolean;
  onToggleSeller: () => Promise<void> | void;
  onToggleAdmin: () => Promise<void> | void;
};

export function UserRoleForm({ isSeller, isAdmin, onToggleSeller, onToggleAdmin }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant={isSeller ? 'primary' : 'outline'}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              await onToggleSeller();
              toast.success(isSeller ? 'Peran penjual dicabut' : 'Pengguna kini menjadi penjual');
            } catch (error) {
              toast.error('Tidak dapat memperbarui peran penjual');
              console.error(error);
            }
          })
        }
      >
        {isSeller ? 'Cabut Penjual' : 'Jadikan Penjual'}
      </Button>
      <Button
        type="button"
        variant={isAdmin ? 'primary' : 'outline'}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              await onToggleAdmin();
              toast.success(isAdmin ? 'Admin dicabut' : 'Pengguna kini menjadi admin');
            } catch (error) {
              toast.error('Tidak dapat memperbarui status admin');
              console.error(error);
            }
          })
        }
      >
        {isAdmin ? 'Cabut Admin' : 'Jadikan Admin'}
      </Button>
    </div>
  );
}
