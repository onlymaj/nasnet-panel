import { test, expect } from './fixtures';

const ROUTER_ID = 'rtr_vpn';

const envelope = <T>(data: T) => JSON.stringify({ status: 200, message: 'OK', data });

const baseClient = {
  id: '*1',
  name: 'home-l2tp',
  type: 'l2tp-out',
  running: false,
  disabled: true,
  mtu: 1450,
  macAddress: '',
  rxByte: 0,
  txByte: 0,
  rxPacket: 0,
  txPacket: 0,
  lastLinkUp: '',
  lastLinkDown: '',
  linkDowns: 0,
};

test.describe('VPN clients tab', () => {
  test('lists clients from backend and toggles enable via PUT', async ({
    page,
    context,
    resetMocks,
    seedRouter,
  }) => {
    await resetMocks();
    await seedRouter({ id: ROUTER_ID, name: 'VPN Router', host: '10.0.0.10' });

    await context.addInitScript((routerId) => {
      try {
        const key = 'nasnet-panel.session-credentials.v1';
        const raw = window.sessionStorage.getItem(key);
        const map = (raw ? JSON.parse(raw) : {}) as Record<
          string,
          { username: string; password: string }
        >;
        map[routerId] = { username: 'admin', password: 'test' };
        window.sessionStorage.setItem(key, JSON.stringify(map));
      } catch {
        /* ignore */
      }
    }, ROUTER_ID);

    await context.route('**/api/vpn/clients', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: envelope([baseClient]),
        });
        return;
      }
      await route.fallback();
    });

    await context.route('**/api/vpn/servers', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: envelope({
          ovpnServers: [],
          wireguards: [],
          pptp: null,
          l2tp: null,
          sstp: null,
        }),
      });
    });

    let lastPutBody: { disabled?: boolean; comment?: string } | null = null;
    await context.route('**/api/vpn/clients/home-l2tp', async (route) => {
      if (route.request().method() === 'PUT') {
        lastPutBody = route.request().postDataJSON() as typeof lastPutBody;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: envelope({ ...baseClient, disabled: false }),
        });
        return;
      }
      await route.fallback();
    });

    await page.goto(`/router/${ROUTER_ID}/vpn`);

    const row = page.getByRole('row', { name: /home-l2tp/ });
    await expect(row).toBeVisible();
    await expect(row.getByText('L2TP', { exact: true })).toBeVisible();

    await row.getByRole('switch', { name: /enabled/i }).click();
    await expect.poll(() => lastPutBody?.disabled).toBe(false);
  });

  test('renders empty-state icon when no clients are configured', async ({
    page,
    context,
    resetMocks,
    seedRouter,
  }) => {
    await resetMocks();
    await seedRouter({ id: ROUTER_ID, name: 'VPN Router', host: '10.0.0.10' });

    await context.addInitScript((routerId) => {
      try {
        const key = 'nasnet-panel.session-credentials.v1';
        const raw = window.sessionStorage.getItem(key);
        const map = (raw ? JSON.parse(raw) : {}) as Record<
          string,
          { username: string; password: string }
        >;
        map[routerId] = { username: 'admin', password: 'test' };
        window.sessionStorage.setItem(key, JSON.stringify(map));
      } catch {
        /* ignore */
      }
    }, ROUTER_ID);

    await context.route('**/api/vpn/clients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: envelope([]),
      });
    });
    await context.route('**/api/vpn/servers', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: envelope({
          ovpnServers: [],
          wireguards: [],
          pptp: null,
          l2tp: null,
          sstp: null,
        }),
      });
    });

    await page.goto(`/router/${ROUTER_ID}/vpn`);

    await expect(page.getByText('No VPN clients yet.')).toBeVisible();
    await expect(page.getByText('No VPN servers configured.')).toBeVisible();
  });
});
