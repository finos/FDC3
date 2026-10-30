// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAuditJsOutput, severityFromCvss, parsePurl, buildSonatypeFindings } from './sonatype.mjs';
import { mergeFindings } from './report.mjs';

const rootPkg = { workspaces: ['packages/lib', 'toolbox/app'] };
const lock = {
  packages: {
    '': { name: 'root' },
    'packages/lib': { name: 'lib', dependencies: { '@s/core': '1' } },
    'toolbox/app': { name: 'app', dependencies: { express: '1' } },
    'node_modules/@s/core': { version: '1.2.3' },
    'node_modules/express': { version: '4.0.0' },
  },
};

const result = (purl, vulns) => ({ coordinates: purl, reference: 'https://ossindex/x', vulnerabilities: vulns });
const vuln = (over = {}) => ({
  id: 'sonatype-2024-0001',
  title: 'Bad',
  cvssScore: '9.8',
  cve: 'CVE-2024-0001',
  reference: 'https://ref',
  ...over,
});

test('parses JSON surrounded by progress text and rejects garbage', () => {
  assert.equal(parseAuditJsOutput('Auditing...\n[{"coordinates":"x"}]\n').length, 1);
  assert.throws(() => parseAuditJsOutput('Error: 401 Unauthorized'), /JSON array/);
});

test('cvss to severity buckets', () => {
  assert.deepEqual(['10', '9.0', '7.5', '4', '3.9', '0', 'x'].map(severityFromCvss), [
    'critical',
    'critical',
    'high',
    'medium',
    'low',
    'low',
    'low',
  ]);
});

test('parsePurl decodes scoped names', () => {
  assert.deepEqual(parsePurl('pkg:npm/%40s/core@1.2.3'), { name: '@s/core', version: '1.2.3' });
  assert.equal(parsePurl('pkg:maven/a/b@1'), null);
});

test('components are attributed to library or toolbox by runtime reachability', () => {
  const out = buildSonatypeFindings(
    [
      result('pkg:npm/%40s/core@1.2.3', [vuln()]),
      result('pkg:npm/express@4.0.0', [vuln({ id: 'sonatype-2024-0002', cve: '', cvssScore: '5.0' })]),
      result('pkg:npm/clean@1.0.0', []),
    ],
    lock,
    rootPkg
  );
  assert.equal(out.library.length, 1);
  assert.deepEqual(out.library[0].workspace, ['packages/lib']);
  assert.equal(out.library[0].severity, 'critical');
  assert.deepEqual(out.library[0].ids, ['CVE-2024-0001', 'sonatype-2024-0001']);
  assert.equal(out.toolbox.length, 1);
  assert.deepEqual(out.toolbox[0].ids, ['sonatype-2024-0002']);
});

test('sonatype and npm-audit findings merge on a shared CVE/GHSA id', () => {
  const [s] = buildSonatypeFindings([result('pkg:npm/%40s/core@1.2.3', [vuln()])], lock, rootPkg).library;
  const npm = { ...s, source: 'npm-audit', ids: ['GHSA-2222-3333-4444', 'CVE-2024-0001'], fixAvailable: true };
  const merged = mergeFindings([npm, s]);
  assert.equal(merged.length, 1);
  assert.deepEqual(merged[0].sources, ['npm-audit', 'sonatype']);
});
