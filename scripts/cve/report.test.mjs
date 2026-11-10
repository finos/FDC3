// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { renderReport, renderTier, renderOverview, fixText, loadResults, tierStatus } from './report.mjs';

const finding = (over = {}) => ({
  tier: 'library',
  scope: 'runtime',
  workspace: ['packages/x'],
  package: 'lodash',
  version: '4.0.0',
  severity: 'high',
  ids: ['GHSA-2222-3333-4444'],
  title: 'Prototype | pollution',
  url: 'https://github.com/advisories/GHSA-2222-3333-4444',
  fixAvailable: true,
  fixIsMajor: false,
  source: 'npm-audit',
  ...over,
});

test('empty library tier is clean; missing tiers are flagged', () => {
  const md = renderReport({ library: { tier: 'library', findings: [], suppressed: [] } });
  assert.match(md, /Library packages \| ✅ clean/);
  assert.match(md, /No unsuppressed vulnerabilities found/);
  assert.match(renderOverview({}), /Library packages \| ⚠️ no results/);
  assert.match(renderTier('library', undefined), /No results were produced/);
});

test('mixed severities: overview counts, fix text, pipe escaping', () => {
  const result = {
    tier: 'library',
    findings: [
      finding(),
      finding({
        package: 'dev-thing',
        scope: 'dev',
        severity: 'low',
        ids: ['GHSA-cccc-cccc-cccc'],
        fixAvailable: false,
      }),
      finding({
        package: 'm',
        severity: 'medium',
        ids: ['GHSA-3333-3333-3333'],
        fixIsMajor: true,
        fixVersion: '9.0.0',
      }),
    ],
    suppressed: [],
  };
  const md = renderReport({ library: result });
  assert.match(md, /❌ failing \| 🟠 1 high, 🟡 1 medium \| ⚪ 1 low/);
  assert.match(md, /Prototype \\\| pollution/);
  assert.match(md, /no fix/);
  assert.match(md, /major bump \(9\.0\.0\)/);
  assert.equal(tierStatus('toolbox', { findings: [finding()] }), '⚠️ findings');
});

test('backslashes are escaped before pipes so a title cannot break out of its table cell', () => {
  const md = renderTier('library', {
    findings: [finding({ title: 'path\\|injected' })],
    suppressed: [],
  });
  // `\` -> `\\` and `|` -> `\|`, giving `path\\\|injected`
  assert.ok(md.includes('path\\\\\\|injected'));
});

test('suppressed findings are listed with their reason', () => {
  const md = renderTier('toolbox', {
    findings: [],
    suppressed: [finding({ suppressedBy: 'CVE-2024-1', suppressedReason: 'not reachable' })],
  });
  assert.match(md, /1 suppressed by allow-list\.json/);
  assert.match(md, /not reachable/);
});

test('actions tier counts all workflow findings in the first column', () => {
  const md = renderOverview({
    actions: { tier: 'actions', findings: [finding({ scope: 'workflow', severity: 'medium' })], suppressed: [] },
  });
  assert.match(md, /GitHub Actions \| ⚠️ findings \| 🟡 1 medium \| - \|/);
});

test('fixText', () => {
  assert.equal(fixText({ fixAvailable: false }), 'no fix');
  assert.equal(fixText({ fixAvailable: true }), 'fix available');
  assert.equal(fixText({ fixAvailable: true, fixIsMajor: true }), 'major bump');
});

test('loadResults reads nested artifact directories and ignores other files', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cve-'));
  try {
    fs.mkdirSync(path.join(dir, 'a'));
    fs.mkdirSync(path.join(dir, 'b'));
    fs.writeFileSync(
      path.join(dir, 'a', 'findings-library.json'),
      JSON.stringify({ tier: 'library', findings: [finding()], suppressed: [] })
    );
    fs.writeFileSync(path.join(dir, 'b', 'findings-website.json'), JSON.stringify({ tier: 'website', findings: [] }));
    fs.writeFileSync(path.join(dir, 'ignored.json'), '{}');
    const results = loadResults(dir);
    assert.deepEqual(Object.keys(results).sort(), ['library', 'website']);
    assert.equal(results.library.findings.length, 1);
    assert.deepEqual(results.website.suppressed, []);
  } finally {
    fs.rmSync(dir, { recursive: true });
  }
});
