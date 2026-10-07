import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'node',
    reporters: ['default', 'junit'],
    outputFile: 'test-results.xml',
    testTimeout: 25000,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/index.ts',
        'src/impl/PublicFDC3Security.ts',
        'src/impl/PrivateFDC3Security.ts',
        'src/impl/FDC3UserClaims.ts',
        'src/secure-boundary/Messaging.ts',
      ],
    },
  },
});
