import { test, expect } from './fixtures';

test.describe('Theme toggle', () => {
  test('switches light/dark, persists across reloads', async ({ page, resetMocks }) => {
    await resetMocks();
    await page.goto('/');

    const toggle = page.getByRole('button', { name: /theme/i });
    await toggle.click();

    await page.getByRole('menuitem', { name: /light/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await toggle.click();
    await page.getByRole('menuitem', { name: /dark/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});
