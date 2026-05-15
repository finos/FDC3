/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

import { BrowserTypes } from '@finos/fdc3-schema';
import { AntiReplayChecker, DefaultAntiReplayChecker } from '../src/impl/AntiReplayChecker';

type AntiReplayClaims = BrowserTypes.AntiReplayClaims;

describe('DefaultAntiReplayChecker', () => {
  it('accepts the first use of a jti and rejects an identical replay', async () => {
    const checker = new DefaultAntiReplayChecker();
    const claims: AntiReplayClaims = {
      jti: 'unique-jti-1',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
    expect(await checker.check(claims)).toBe(true);
    expect(await checker.check(claims)).toBe(false);
  });

  it('rejects claims with a missing jti', async () => {
    const checker = new DefaultAntiReplayChecker();
    const claims = { iat: 1, exp: 9_999_999_999 } as AntiReplayClaims;
    expect(await checker.check(claims)).toBe(false);
  });

  it('allows different jtis independently', async () => {
    const checker = new DefaultAntiReplayChecker();
    const exp = Math.floor(Date.now() / 1000) + 3600;
    expect(await checker.check({ jti: 'a', iat: 1, exp })).toBe(true);
    expect(await checker.check({ jti: 'b', iat: 1, exp })).toBe(true);
  });

  it('runs cleanup when the store grows past 1000 entries', async () => {
    const checker = new DefaultAntiReplayChecker();
    const now = Math.floor(Date.now() / 1000);
    const pastExp = now - 10;
    for (let i = 0; i < 1001; i++) {
      const ok = await checker.check({ jti: `bulk-${i}`, iat: now, exp: pastExp });
      expect(ok).toBe(true);
    }
    expect(await checker.check({ jti: 'after-cleanup', iat: now, exp: now + 3600 })).toBe(true);
  });
});

describe('AntiReplayChecker (contract)', () => {
  it('allows a custom implementation to be used in place of DefaultAntiReplayChecker', async () => {
    const alwaysNo: AntiReplayChecker = {
      async check() {
        return false;
      },
    };
    expect(await alwaysNo.check({ jti: 'x', iat: 1, exp: 2 })).toBe(false);
  });
});
