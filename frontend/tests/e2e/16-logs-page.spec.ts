import { test, expect } from './fixtures';

test.describe('Logs page', () => {
  test('tab is reachable, filters and search narrow the list', async ({
    page,
    resetMocks,
    seedRouter,
  }) => {
    await resetMocks();
    await seedRouter({ id: 'rtr_logs', name: 'Logs Router' });
    await page.goto('/router/rtr_logs/logs');

    await expect(page.getByRole('heading', { name: /^logs$/i })).toBeVisible();
    const stream = page.getByTestId('log-stream');
    await expect(stream).toBeVisible();
    await expect(stream.getByTestId('log-row').first()).toBeVisible();

    // Level filter keeps the stream populated (or explicitly empty).
    await page.getByLabel(/level/i).click();
    await page.getByRole('option', { name: 'error' }).click();
    await expect(stream).toBeVisible();

    // Text search reveals the pppoe error message.
    await page.getByLabel(/level/i).click();
    await page.getByRole('option', { name: 'all' }).click();
    await page.getByLabel(/search/i).fill('pppoe');
    await expect(stream).toContainText(/pppoe/i);

    // Auto-tail toggles without error.
    await page.getByRole('switch', { name: /auto-tail/i }).check();
    await expect(page.getByRole('switch', { name: /auto-tail/i })).toBeChecked();
  });

  test('dashboard tab nav exposes Logs link', async ({ page, resetMocks, seedRouter }) => {
    await resetMocks();
    await seedRouter({ id: 'rtr_logs2', name: 'Logs Router 2' });
    await page.goto('/router/rtr_logs2');
    await expect(page.getByRole('tab', { name: /logs/i })).toBeVisible();
    await page.getByRole('tab', { name: /logs/i }).click();
    await expect(page).toHaveURL(/\/router\/rtr_logs2\/logs$/);
  });
});
