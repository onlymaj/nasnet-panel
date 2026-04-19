import { test, expect } from './fixtures';

test.describe('Updates page', () => {
  test('check + install app update flow', async ({ page, resetMocks, seedRouter }) => {
    await resetMocks();
    await seedRouter({ id: 'rtr_upd', name: 'Update Router' });
    await page.goto('/updates');

    await expect(page.getByRole('heading', { name: /app update/i })).toBeVisible();
    await expect(page.getByTestId('app-current-version')).toBeVisible();
    await expect(page.getByTestId('app-latest-version')).toBeVisible();

    await page.getByRole('button', { name: /install app/i }).click();
    await expect(page.getByText(/update complete/i)).toBeVisible();
  });

  test('firmware update flow requires confirmation', async ({ page, resetMocks, seedRouter }) => {
    await resetMocks();
    await seedRouter({ id: 'rtr_upd', name: 'Update Router' });
    await page.goto('/updates');
    await page.getByRole('button', { name: /install firmware/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /^confirm$/i }).click();
    await expect(page.getByText(/firmware update complete/i)).toBeVisible();
  });
});
