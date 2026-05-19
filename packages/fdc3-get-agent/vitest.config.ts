import { defineConfig } from 'vitest/config';
import { quickpickle } from 'quickpickle';

export default defineConfig({
  plugins: [
    quickpickle({
      stepTimeout: 15000,
    }),
  ],
  resolve: {
    dedupe: ['quickpickle'],
  },
  test: {
    include: ['test/features/**/*.feature'],
    setupFiles: ['test/steps.ts'],
    testTimeout: 30000,
    server: {
      deps: {
        inline: ['quickpickle'],
      },
    },
    reporters: ['default', 'junit', 'html'],
    outputFile: {
      junit: 'test-results.xml',
      html: 'html-test-results/index.html',
    },
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/**/*.test.ts', 'src/**/*.spec.ts'],
    },
  },
});
