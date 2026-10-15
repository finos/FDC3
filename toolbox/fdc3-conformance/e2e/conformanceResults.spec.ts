/*
 * Copyright (c) 2026 Future Edge Group FZE
 * SPDX-License-Identifier: Apache-2.0
 */

import { expect, test } from '@playwright/test';
import { assertConformancePassed } from './conformanceResults';

test.describe('conformance result gate', () => {
  test('accepts a completed passing run', () => {
    expect(() =>
      assertConformancePassed({
        status: 'passed',
        passes: 42,
        failures: 0,
        tests: 42,
        failureMessages: [],
      })
    ).not.toThrow();
  });

  test('rejects a failed or timed-out conformance test', () => {
    expect(() =>
      assertConformancePassed({
        status: 'failed',
        passes: 41,
        failures: 1,
        tests: 42,
        failureMessages: ['Desktop Agent test: Timeout of 10000ms exceeded'],
      })
    ).toThrow(/1 conformance test\(s\) failed[\s\S]*Timeout of 10000ms exceeded/);
  });

  test('rejects a run that ends without completing every test', () => {
    expect(() =>
      assertConformancePassed({
        status: 'passed',
        passes: 41,
        failures: 0,
        tests: 42,
        failureMessages: [],
      })
    ).toThrow(/run was incomplete: 41 of 42 test\(s\) completed/);
  });
});
