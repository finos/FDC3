// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

import test from 'node:test';
import assert from 'node:assert/strict';
import { parseZizmorOutput, buildActionsFindings, locationPath } from './zizmor.mjs';
import { applyAllowlist } from './npm-audit.mjs';

const loc = (file, over = {}, key = 'given_path') => ({
  symbolic: { key: { Local: { [key]: file } }, annotation: 'note', kind: 'Primary', ...over },
  concrete: { feature: 'uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7' },
});

const raw = (ident, severity, locations, over = {}) => ({
  ident,
  desc: `${ident} description`,
  url: `https://docs.zizmor.sh/audits/#${ident}`,
  determinations: { severity },
  locations,
  ignored: false,
  ...over,
});

test('parse rejects non-arrays', () => {
  assert.throws(() => parseZizmorOutput('{}'), /array/);
  assert.equal(parseZizmorOutput('[]').length, 0);
});

test('location path works for both key shapes', () => {
  assert.equal(locationPath(loc('a.yml')), 'a.yml');
  assert.equal(locationPath(loc('b.yml', {}, 'verbatim_path')), 'b.yml');
});

test('hardening findings are grouped per audit across files, taking the max severity', () => {
  const out = buildActionsFindings([
    raw('artipacked', 'Medium', [loc('a.yml')]),
    raw('artipacked', 'High', [loc('b.yml')]),
    raw('artipacked', 'Medium', [loc('a.yml')]),
    raw('excessive-permissions', 'High', [loc('a.yml')]),
  ]);
  assert.equal(out.length, 2);
  const art = out.find(f => f.package === 'artipacked');
  assert.deepEqual(art.workspace, ['a.yml', 'b.yml']);
  assert.equal(art.severity, 'high');
  assert.equal(art.kind, 'hardening');
  assert.equal(art.scope, 'workflow');
  assert.equal(art.tier, 'actions');
});

test('known-vulnerable-actions become advisory findings, sorted first, and honour the allow-list', () => {
  const out = buildActionsFindings([
    raw('excessive-permissions', 'High', [loc('a.yml')]),
    raw('known-vulnerable-actions', 'High', [
      loc('a.yml', { annotation: 'action is vulnerable: GHSA-2222-3333-4444' }),
    ]),
    raw('artipacked', 'Medium', [loc('b.yml')], { ignored: true }),
  ]);
  assert.equal(out.length, 2, 'ignored findings dropped');
  assert.equal(out[0].kind, 'vulnerability');
  assert.equal(out[0].package, 'actions/checkout');
  assert.equal(out[0].version, '3d3c42e5aac5');
  assert.deepEqual(out[0].ids, ['GHSA-2222-3333-4444']);

  const { active, suppressed } = applyAllowlist(out, [{ id: 'GHSA-2222-3333-4444', reason: 'not exploitable here' }]);
  assert.equal(suppressed.length, 1);
  assert.equal(active[0].package, 'excessive-permissions');
});

test('severity mapping', () => {
  const sev = s => buildActionsFindings([raw('x', s, [loc('a.yml')])])[0].severity;
  assert.deepEqual(['Informational', 'Low', 'Medium', 'High', 'Unknown'].map(sev), [
    'low',
    'low',
    'medium',
    'high',
    'medium',
  ]);
});
