/**
 * Vitest test setup for firewall feature
 */

import '@testing-library/jest-dom/vitest';

// Mock ResizeObserver (not available in JSDOM)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
