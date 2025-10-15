import { describe, expect, it } from 'vitest';
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats numbers to Indonesian Rupiah without decimals', () => {
    const result = formatCurrency(12500);
    expect(result).toMatch(/Rp\s?12.500/);
  });
});
