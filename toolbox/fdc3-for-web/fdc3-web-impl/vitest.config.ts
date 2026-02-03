import { defineConfig } from 'vitest/config';
import { quickpickle } from 'quickpickle';

export default defineConfig({
  plugins: [
    quickpickle({
      stepTimeout: 15000,
    }),
  ],
  test: {
    include: ['test/features/**/*.feature'],
    setupFiles: ['test/steps.ts'],
    testTimeout: 30000,
    fileParallelism: false,
    isolate: false,
    reporters: ['default', 'html', 'junit'],
    outputFile: {
      junit: 'test-results.xml',
      html: 'html-report/index.html',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov', 'json'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/**/*.test.ts', 'src/**/*.spec.ts'],
    },
  },
});
