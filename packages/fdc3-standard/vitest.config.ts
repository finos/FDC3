import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov', 'json'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts'],
    },
  },
});
