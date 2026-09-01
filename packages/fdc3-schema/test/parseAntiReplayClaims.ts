/**
 * SPDX-License-Identifier: Apache-2.0
 * Copyright FINOS FDC3 contributors - see NOTICE file
 */

/** Parses `iat/exp/jti` from a single Gherkin string (three slash-separated parts). */
export function parseAntiReplayClaims(claims: string): { iat: number; exp: number; jti: string } {
  const parts = claims.split('/');
  if (parts.length !== 3) {
    throw new Error(`antiReplay claims must be three slash-separated parts (iat/exp/jti), got: ${claims}`);
  }
  const iat = Number(parts[0]);
  const exp = Number(parts[1]);
  const jti = parts[2];
  if (!Number.isFinite(iat) || !Number.isFinite(exp)) {
    throw new Error(`antiReplay iat and exp must be finite numbers, got iat=${parts[0]}, exp=${parts[1]}`);
  }
  return { iat, exp, jti };
}
