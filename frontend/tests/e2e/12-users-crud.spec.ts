import { test, expect } from './fixtures';

test.describe('Router users CRUD', () => {
  test('create, edit, delete a router user', async ({ page, resetMocks, seedRouter }) => {
    await resetMocks();
    await seedRouter({ id: 'rtr_usr', name: 'Users Router' });
    await page.goto('/router/rtr_usr/users');

    await expect(page.getByRole('row', { name: /admin/ })).toBeVisible();

    await page.getByRole('button', { name: /new user/i }).click();
    await page.getByLabel(/name/i).fill('readonly');
    await page.getByLabel(/^password$/i).fill('readonly-secret');
    await page.getByLabel(/group/i).click();
    await page.getByRole('option', { name: 'read' }).click();
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('row', { name: /readonly/ })).toBeVisible();

    await page
      .getByRole('row', { name: /readonly/ })
      .getByRole('button', { name: /edit/i })
      .click();
    await page.getByRole('checkbox', { name: /disabled/i }).check();
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('row', { name: /readonly/ })).toContainText(/disabled/i);

    await page
      .getByRole('row', { name: /readonly/ })
      .getByRole('button', { name: /delete/i })
      .click();
    await page.getByRole('button', { name: /^confirm$/i }).click();
    await expect(page.getByRole('row', { name: /readonly/ })).toHaveCount(0);
  });
});
