import { test, expect } from '@playwright/test';

test.describe('Alur belanja UMKM', () => {
  test('pengguna dapat melihat beranda', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Belanja produk pilihan UMKM')).toBeVisible();
  });

  test.skip('alur checkout fiktif', async ({ page }) => {
    // Placeholder: implement setelah autentikasi & data tersedia.
    await page.goto('/');
  });
});
