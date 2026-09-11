/*
 * Copyright (c) 2026 Future Edge Group FZE
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 10 * 60 * 1000,
  expect: {
    timeout: 30 * 1000,
  },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4000',
    channel: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://127.0.0.1:3001/apps/app/index.html',
      timeout: 2 * 60 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev --workspace @finos/demo',
      url: 'http://127.0.0.1:4000/static/da/index.html',
      timeout: 2 * 60 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
