/*
 * Copyright 2026 FINOS, The Fintech Open Source Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
