import { test, expect } from './fixtures';

test.describe('Router list landing', () => {
  test('empty state shows scan action + New Router tile', async ({ page, resetMocks }) => {
    await resetMocks();
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Routers' })).toBeVisible();
    await expect(page.getByText(/no routers yet/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /new router/i })).toBeVisible();
  });

  test('populated state renders a card per seeded router and navigates on click', async ({
    page,
    resetMocks,
    seedRouter,
  }) => {
    await resetMocks();
    await seedRouter({ id: 'rtr_test', name: 'Test Gateway', host: '10.9.8.7', status: 'online' });
    await page.goto('/');
    const card = page.getByRole('link', { name: /Test Gateway/ });
    await expect(card).toBeVisible();
    await expect(page.getByText('10.9.8.7')).toBeVisible();
    await expect(page.getByRole('button', { name: /new router/i })).toBeVisible();
    await card.click();
    await expect(page).toHaveURL(/\/router\/rtr_test$/);
  });
});
