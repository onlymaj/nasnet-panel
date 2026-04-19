import { test, expect } from './fixtures';

test.describe('VPN clients CRUD', () => {
  test('add, toggle, edit, delete a WireGuard client', async ({ page, resetMocks, seedRouter }) => {
    await resetMocks();
    await seedRouter({ id: 'rtr_vpn', name: 'VPN Router' });
    await page.goto('/router/rtr_vpn/vpn');

    await page.getByRole('button', { name: /add client/i }).click();

    await page.getByLabel(/name/i).fill('home-wg');
    await page.getByLabel(/endpoint host/i).fill('home.example.com');
    await page.getByLabel(/endpoint port/i).fill('51820');
    await page.getByRole('button', { name: /save/i }).click();

    await expect(page.getByRole('row', { name: /home-wg/ })).toBeVisible();

    await page
      .getByRole('row', { name: /home-wg/ })
      .getByRole('switch', { name: /enabled/i })
      .click();

    await page
      .getByRole('row', { name: /home-wg/ })
      .getByRole('button', { name: /edit/i })
      .click();
    await page.getByLabel(/name/i).fill('home-wg-renamed');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('row', { name: /home-wg-renamed/ })).toBeVisible();

    await page
      .getByRole('row', { name: /home-wg-renamed/ })
      .getByRole('button', { name: /delete/i })
      .click();
    await page.getByRole('button', { name: /^confirm$/i }).click();
    await expect(page.getByRole('row', { name: /home-wg-renamed/ })).toHaveCount(0);
  });
});
