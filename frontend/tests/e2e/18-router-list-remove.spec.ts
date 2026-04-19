import { test, expect } from './fixtures';

test.describe('Router list — remove router', () => {
  test('clicking the remove icon + confirming removes the router card', async ({
    page,
    resetMocks,
    seedRouter,
  }) => {
    await resetMocks();
    await seedRouter({ id: 'rtr_to_remove', name: 'Disposable', host: '10.9.8.7' });
    await seedRouter({ id: 'rtr_keeper', name: 'Keeper', host: '10.9.8.8' });
    await page.goto('/');

    await expect(page.getByRole('link', { name: /Disposable/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Keeper/ })).toBeVisible();

    await page.getByRole('button', { name: /remove disposable/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /^remove$/i }).click();

    await expect(page.getByRole('link', { name: /Disposable/ })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Keeper/ })).toBeVisible();
    await expect(page.getByText(/router removed/i)).toBeVisible();
  });

  test('cancel closes the dialog and keeps the router', async ({
    page,
    resetMocks,
    seedRouter,
  }) => {
    await resetMocks();
    await seedRouter({ id: 'rtr_safe', name: 'Safe Router', host: '10.9.8.9' });
    await page.goto('/');
    await page.getByRole('button', { name: /remove safe router/i }).click();
    await page.getByRole('button', { name: /cancel/i }).click();
    await expect(page.getByRole('link', { name: /Safe Router/ })).toBeVisible();
  });
});
