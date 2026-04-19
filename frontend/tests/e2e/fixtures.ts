import { test as base } from '@playwright/test';
import type { Router } from '../../packages/mocks/src/types';

export interface SeedInput extends Partial<Router> {
  id: string;
}

export interface TestFixtures {
  resetMocks: () => Promise<void>;
  seedRouter: (input: SeedInput) => Promise<void>;
}

export const test = base.extend<TestFixtures>({
  resetMocks: async ({ context }, use) => {
    await use(async () => {
      await context.addInitScript(() => {
        try {
          if (window.localStorage.getItem('nasnet-panel.test.reset-done') === 'yes') {
            return;
          }
          window.localStorage.removeItem('nasnet-panel.router-store.v1');
          window.sessionStorage.removeItem('nasnet-panel.mock-store.v1');
          window.localStorage.setItem('nasnet-panel.test.reset-done', 'yes');
        } catch {
          /* ignore */
        }
        window.__SEED_EMPTY__ = true;
        window.__PENDING_SEEDS__ = [];
      });
    });
  },
  seedRouter: async ({ context }, use) => {
    await use(async (input) => {
      await context.addInitScript((seed) => {
        window.__PENDING_SEEDS__ = window.__PENDING_SEEDS__ ?? [];
        window.__PENDING_SEEDS__.push(seed);
      }, input);
    });
  },
});

declare global {
  interface Window {
    __MOCKS__?: {
      reset: () => void;
      seedEmpty: () => void;
      seedRouter: (input: SeedInput) => Router;
    };
    __SEED_EMPTY__?: boolean;
    __PENDING_SEEDS__?: SeedInput[];
  }
}

export const expect = test.expect;
