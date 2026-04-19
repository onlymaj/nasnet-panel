import { test, expect } from './fixtures';

test.describe('Logo + favicon', () => {
  test('header logo image loads and favicon is served', async ({ page, resetMocks }) => {
    await resetMocks();
    await page.goto('/');
    const logo = page.getByRole('img', { name: /nasnet panel/i }).first();
    await expect(logo).toBeVisible();
    const src = await logo.getAttribute('src');
    expect(src).toBe('/favicon.png');

    const logoRes = await page.request.get('/favicon.png');
    expect(logoRes.ok()).toBeTruthy();
    expect(logoRes.headers()['content-type']).toContain('image/png');
  });
});
