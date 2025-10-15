'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  label?: string;
};

export function PrintReceiptButton({ label = 'Cetak / Simpan' }: Props) {
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <Button type="button" onClick={handlePrint}>
      {label}
    </Button>
  );
}
