/*
 * Copyright (c) 2026 Future Edge Group FZE
 * SPDX-License-Identifier: Apache-2.0
 */

import { expect, test } from '@playwright/test';
import { assertConformancePassed } from './conformanceResults';

test('runs all automated conformance tests against the reference Desktop Agent', async ({ page }) => {
  await page.goto('/static/da/index.html');

  const conformanceApp = page.locator('.da-app-card').filter({ hasText: 'FDC3 Conformance Framework' });
  await expect(conformanceApp).toBeVisible();
  await conformanceApp.getByRole('button', { name: 'Start' }).click();

  const runner = page.frameLocator('#app-frames iframe').first();
  const runButton = runner.getByRole('button', { name: 'Run', exact: true }).first();
  await expect(runButton).toBeVisible();
  await runner.locator('#testSuite').selectOption({ label: 'All' });
  await runButton.click();

  const results = runner.locator('#mocha');
  await expect(results).toHaveAttribute('data-conformance-status', /passed|failed/, {
    timeout: 9 * 60 * 1000,
  });

  const status = await results.getAttribute('data-conformance-status');
  const passes = Number(await results.getAttribute('data-conformance-passes'));
  const failures = Number(await results.getAttribute('data-conformance-failures'));
  const tests = Number(await results.getAttribute('data-conformance-tests'));
  const failureMessages = JSON.parse((await results.getAttribute('data-conformance-failure-messages')) ?? '[]');

  assertConformancePassed({ status, passes, failures, tests, failureMessages });
});
