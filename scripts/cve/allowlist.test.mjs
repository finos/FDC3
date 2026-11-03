// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateAllowlist,
  isExpired,
  findSuppression,
  toAuditJsFormat,
  toGhsaList,
  loadAllowlist,
} from './allowlist.mjs';

const NOW = new Date('2026-06-01T12:00:00Z');
const GHSA = 'GHSA-2222-3333-4444';

test('repo allow-list.json is valid', () => {
  assert.ok(Array.isArray(loadAllowlist()));
});

test('validate rejects malformed entries', () => {
  assert.throws(() => validateAllowlist({}), /"ignore" array/);
  assert.throws(() => validateAllowlist({ ignore: [{ id: 'nope', reason: 'x' }] }), /"id"/);
  assert.throws(() => validateAllowlist({ ignore: [{ id: 'CVE-2024-1234' }] }), /"reason"/);
  assert.throws(
    () => validateAllowlist({ ignore: [{ id: 'CVE-2024-1234', reason: 'x', expires: '01/02/2027' }] }),
    /"expires"/
  );
});

test('expiry is inclusive of the final day', () => {
  assert.equal(isExpired({ expires: '2026-06-01' }, NOW), false);
  assert.equal(isExpired({ expires: '2026-05-31' }, NOW), true);
  assert.equal(isExpired({}, NOW), false);
});

test('findSuppression matches CVE or GHSA alias and ignores expired entries', () => {
  const entries = [
    { id: 'CVE-2024-0001', reason: 'a', ghsa: GHSA },
    { id: 'CVE-2024-0002', reason: 'b', expires: '2026-01-01' },
  ];
  assert.equal(findSuppression({ ids: ['cve-2024-0001'] }, entries, NOW)?.reason, 'a');
  assert.equal(findSuppression({ ids: [GHSA] }, entries, NOW)?.reason, 'a');
  assert.equal(findSuppression({ ids: ['CVE-2024-0002'] }, entries, NOW), null);
  assert.equal(findSuppression({ ids: ['CVE-2024-9999'] }, entries, NOW), null);
});

test('toAuditJsFormat strips extra fields and expired entries', () => {
  const entries = [
    { id: 'CVE-2024-0001', reason: 'a', ghsa: GHSA, expires: '2027-01-01' },
    { id: 'CVE-2024-0002', reason: 'b', expires: '2026-01-01' },
  ];
  assert.deepEqual(toAuditJsFormat(entries, NOW), { ignore: [{ id: 'CVE-2024-0001', reason: 'a' }] });
});

test('toGhsaList collects GHSA ids and aliases only', () => {
  const entries = [
    { id: 'CVE-2024-0001', reason: 'a', ghsa: GHSA },
    { id: 'GHSA-aaaa-bbbb-cccc'.replace(/[ab]/g, 'c'), reason: 'b' },
  ];
  assert.deepEqual(toGhsaList(entries, NOW), [GHSA, 'GHSA-cccc-cccc-cccc']);
});
