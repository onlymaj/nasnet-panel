import { test, expect } from './fixtures';

test.describe('Wireless standalone', () => {
  test('edit and persist SSID and password via edit dialog', async ({
    page,
    resetMocks,
    seedRouter,
  }) => {
    await resetMocks();
    await seedRouter({ id: 'rtr_wire', name: 'Wireless Router' });
    await page.goto('/router/rtr_wire/wireless');

    await page.getByRole('button', { name: /^edit$/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const ssid = page.getByLabel('SSID');
    const pw = page.getByLabel('Password', { exact: true });
    await expect(ssid).toBeVisible();
    await ssid.fill('RenamedNetwork');
    await pw.fill('newpass123');
    await page.getByRole('button', { name: /^save$/i }).click();
    await expect(page.getByText(/wireless settings saved/i)).toBeVisible();

    await page.reload();
    await page.getByRole('button', { name: /^edit$/i }).click();
    await expect(page.getByLabel('SSID')).toHaveValue('RenamedNetwork');
    await expect(page.getByLabel('Password', { exact: true })).toHaveValue('newpass123');
  });
});
