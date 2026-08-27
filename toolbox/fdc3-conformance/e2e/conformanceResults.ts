/*
 * Copyright (c) 2026 Future Edge Group FZE
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ConformanceResults {
  status: string | null;
  passes: number;
  failures: number;
  tests: number;
  failureMessages: string[];
}

export function assertConformancePassed(results: ConformanceResults): void {
  const errors: string[] = [];

  if (results.status !== 'passed') {
    errors.push(`status was ${JSON.stringify(results.status)}, expected "passed"`);
  }
  if (results.passes <= 0) {
    errors.push('the automated conformance pack did not execute any passing tests');
  }
  if (results.failures !== 0) {
    errors.push(`${results.failures} conformance test(s) failed`);
  }
  if (results.passes + results.failures !== results.tests) {
    errors.push(`the run was incomplete: ${results.passes + results.failures} of ${results.tests} test(s) completed`);
  }

  if (errors.length > 0) {
    throw new Error([...errors, ...results.failureMessages].join('\n'));
  }
}
