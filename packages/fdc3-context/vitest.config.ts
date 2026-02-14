import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    reporters: ['default', 'junit'],
    outputFile: 'test-results.xml',
  },
});
