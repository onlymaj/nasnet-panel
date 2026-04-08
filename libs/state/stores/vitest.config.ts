import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: {
      '@nasnet/api-client/core': path.resolve(__dirname, '../../api-client/core/src'),
      '@nasnet/api-client/queries': path.resolve(__dirname, '../../api-client/queries/src'),
      '@nasnet/core/types': path.resolve(__dirname, '../../core/types/src'),
      '@nasnet/core/utils': path.resolve(__dirname, '../../core/utils/src'),
      '@nasnet/state/stores': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      reportsDirectory: '../../../coverage/libs/state/stores',
      provider: 'v8',
    },
  },
});
