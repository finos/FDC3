// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

import test from 'node:test';
import assert from 'node:assert/strict';
import { decide, buildBody, buildTitle, marker, findOpenIssue, applyDecision, tierLabel } from './issues.mjs';

const finding = (over = {}) => ({
  tier: 'toolbox',
  scope: 'dev',
  workspace: ['toolbox/x'],
  package: 'lodash',
  version: '4.0.0',
  severity: 'high',
  ids: ['GHSA-2222-3333-4444'],
  title: 'Bad',
  url: 'https://github.com/advisories/GHSA-2222-3333-4444',
  fixAvailable: true,
  fixIsMajor: false,
  source: 'npm-audit',
  ...over,
});
const withFindings = (...f) => ({ tier: 'toolbox', generatedAt: '2026-01-01T00:00:00Z', findings: f, suppressed: [] });
const clean = withFindings();

test('missing results never create or close anything', () => {
  assert.equal(decide('toolbox', undefined, undefined).action, 'none');
  assert.equal(decide('toolbox', undefined, { number: 3, title: 't', body: 'b' }).action, 'none');
});

test('findings with no open issue -> create, with marker, title count and no timestamp', () => {
  const d = decide(
    'toolbox',
    withFindings(finding(), finding({ package: 'other', ids: ['GHSA-3333-3333-3333'] })),
    undefined,
    'o/r'
  );
  assert.equal(d.action, 'create');
  assert.equal(d.title, 'CVE scan: Toolbox has 2 open findings');
  assert.ok(d.body.startsWith(marker('toolbox')));
  assert.ok(!d.body.includes('Scanned 2026'));
  assert.match(d.body, /github\.com\/o\/r\/actions\/workflows\/cve-scanning\.yml/);
});

test('same findings again -> no edit; changed findings -> update', () => {
  const result = withFindings(finding());
  const first = decide('toolbox', result, undefined, 'o/r');
  const existing = { number: 7, title: first.title, body: first.body };
  assert.equal(decide('toolbox', { ...result, generatedAt: 'later' }, existing, 'o/r').action, 'none');
  const changed = decide('toolbox', withFindings(finding({ severity: 'critical' })), existing, 'o/r');
  assert.equal(changed.action, 'update');
  assert.equal(changed.number, 7);
});

test('clean area closes an open issue and does nothing otherwise', () => {
  assert.deepEqual(decide('toolbox', clean, { number: 9, title: 't', body: 'b' }), { action: 'close', number: 9 });
  assert.equal(decide('toolbox', clean, undefined).action, 'none');
});

test('title pluralisation and body truncation', () => {
  assert.equal(buildTitle('library', 1), 'CVE scan: Library packages has 1 open finding');
  const many = Array.from({ length: 400 }, (_, i) =>
    finding({ package: `p${i}`, title: 'x'.repeat(300), ids: [`CVE-2024-${1000 + i}`] })
  );
  const body = buildBody('toolbox', withFindings(...many), 'o/r');
  assert.ok(body.length < 61000);
  assert.match(body, /Truncated/);
});

test('findOpenIssue matches on marker, ignoring look-alike issues', () => {
  const gh = args => {
    assert.ok(args.includes(tierLabel('toolbox')));
    return JSON.stringify([
      { number: 1, title: 'unrelated', body: 'no marker' },
      { number: 2, title: 'ours', body: `${marker('toolbox')}\nhi` },
    ]);
  };
  assert.equal(findOpenIssue('toolbox', gh).number, 2);
});

test('applyDecision issues the right gh commands; dry run issues none', () => {
  const calls = [];
  const gh = (args, input) => {
    calls.push({ args, input });
    return '';
  };
  const create = { action: 'create', title: 'T', body: 'B' };
  applyDecision('toolbox', create, { gh, dryRun: true });
  assert.equal(calls.length, 0);

  applyDecision('toolbox', create, { gh });
  assert.deepEqual(
    calls.map(c => c.args.slice(0, 2).join(' ')),
    ['label create', 'label create', 'issue create']
  );
  assert.equal(calls[2].input, 'B');

  calls.length = 0;
  applyDecision('toolbox', { action: 'update', number: 5, title: 'T', body: 'B' }, { gh });
  assert.deepEqual(calls[0].args.slice(0, 3), ['issue', 'edit', '5']);
  applyDecision('toolbox', { action: 'close', number: 5 }, { gh });
  assert.deepEqual(calls[1].args.slice(0, 3), ['issue', 'close', '5']);
});
