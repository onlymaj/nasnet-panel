import { test, expect } from './fixtures';

test.describe('VPN server + peers', () => {
  test('create a server and add/delete a peer', async ({ page, resetMocks, seedRouter }) => {
    await resetMocks();
    await seedRouter({ id: 'rtr_vsrv', name: 'Server Router' });
    await page.goto('/router/rtr_vsrv/vpn');

    await page.getByRole('button', { name: /add server/i }).click();
    await page.getByLabel(/name/i).fill('office-wg');
    await page.getByLabel(/listen port/i).fill('51820');
    await page.getByLabel(/ip pool/i).fill('10.8.0.0/24');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText('office-wg')).toBeVisible();

    await page.getByRole('button', { name: /add peer/i }).click();
    await page.getByLabel(/name/i).fill('laptop');
    await page.getByLabel(/allowed ips/i).fill('10.8.0.2/32');
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByRole('row', { name: /laptop/ })).toBeVisible();

    await page
      .getByRole('row', { name: /laptop/ })
      .getByRole('button', { name: /delete/i })
      .click();
    await page.getByRole('button', { name: /^confirm$/i }).click();
    await expect(page.getByRole('row', { name: /laptop/ })).toHaveCount(0);
  });
});
