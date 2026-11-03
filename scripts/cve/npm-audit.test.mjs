// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

import test from 'node:test';
import assert from 'node:assert/strict';
import { reachableFrom, resolveDependency } from './lockfile.mjs';
import {
  buildFindings,
  applyAllowlist,
  shouldFail,
  addCveAliases,
  rootsFor,
  tierOfWorkspace,
  normaliseSeverity,
} from './npm-audit.mjs';

// Root has a dev-only dep (devtool -> vulnlib), lib workspace has runtime dep (a -> nested b) and
// toolbox workspace depends on the library through a workspace link plus its own runtime dep (shared).
const lock = {
  packages: {
    '': { name: 'root', devDependencies: { devtool: '1' } },
    'packages/lib': { name: 'lib', dependencies: { a: '1' }, devDependencies: { devtool: '1' } },
    'toolbox/app': { name: 'app', dependencies: { lib: '*', shared: '1' } },
    'node_modules/lib': { resolved: 'packages/lib', link: true },
    'node_modules/devtool': { version: '1.0.0', dependencies: { vulnlib: '1' } },
    'node_modules/vulnlib': { version: '1.0.0' },
    'node_modules/a': { version: '1.0.0', dependencies: { b: '2' } },
    'node_modules/a/node_modules/b': { version: '2.0.0' },
    'node_modules/b': { version: '1.0.0' },
    'node_modules/shared': { version: '1.0.0', dependencies: { b: '1' } },
  },
};

const adv = (name, ghsa, severity) => ({
  source: 1,
  name,
  title: `${name} problem`,
  url: `https://github.com/advisories/${ghsa}`,
  severity,
});

const report = {
  vulnerabilities: {
    vulnlib: {
      nodes: ['node_modules/vulnlib'],
      fixAvailable: true,
      via: [adv('vulnlib', 'GHSA-2222-3333-4444', 'high')],
    },
    b: {
      nodes: ['node_modules/a/node_modules/b', 'node_modules/b'],
      fixAvailable: { name: 'a', version: '3.0.0', isSemVerMajor: true },
      via: [adv('b', 'GHSA-cccc-cccc-cccc', 'critical')],
    },
    a: { nodes: ['node_modules/a'], fixAvailable: false, via: ['b'] }, // transitive chain entry, no advisory
  },
};

test('resolveDependency prefers nested node_modules then falls back to root', () => {
  assert.equal(resolveDependency(lock.packages, 'node_modules/a', 'b'), 'node_modules/a/node_modules/b');
  assert.equal(resolveDependency(lock.packages, 'node_modules/shared', 'b'), 'node_modules/b');
  assert.equal(resolveDependency(lock.packages, 'packages/lib', 'missing'), null);
});

test('reachableFrom separates runtime from dev and follows workspace links', () => {
  const lib = reachableFrom(lock, 'packages/lib');
  assert.ok(lib.runtime.has('node_modules/a/node_modules/b'));
  assert.ok(!lib.runtime.has('node_modules/devtool'));
  assert.ok(lib.all.has('node_modules/vulnlib'));

  const app = reachableFrom(lock, 'toolbox/app');
  assert.ok(app.runtime.has('packages/lib'), 'workspace link followed');
  assert.ok(app.runtime.has('node_modules/a/node_modules/b'), 'via the library workspace');
  assert.ok(!app.all.has('node_modules/devtool'), "another workspace's devDependencies are not inherited");
});

test('library tier: runtime vs dev scope, workspace attribution, fix info', () => {
  const findings = buildFindings('library', report, lock, [{ name: 'packages/lib', path: 'packages/lib' }]);
  assert.equal(findings.length, 2);
  const [crit, high] = findings; // sorted by severity
  assert.equal(crit.package, 'b');
  assert.equal(crit.scope, 'runtime');
  assert.equal(crit.version, '2.0.0');
  assert.deepEqual(crit.workspace, ['packages/lib']);
  assert.equal(crit.fixAvailable, true);
  assert.equal(crit.fixIsMajor, true);
  assert.equal(high.package, 'vulnlib');
  assert.equal(high.scope, 'dev');
  assert.equal(high.fixIsMajor, false);
});

test('findings only appear in the tier that can reach them', () => {
  const toolbox = buildFindings('toolbox', report, lock, [{ name: 'toolbox/app', path: 'toolbox/app' }]);
  // app reaches both b copies (via lib and via shared) but never vulnlib
  assert.deepEqual(
    toolbox.map(f => f.package),
    ['b']
  );
  assert.equal(toolbox[0].version, '2.0.0, 1.0.0');
});

test('shouldFail only for library runtime high/critical', () => {
  const crit = { scope: 'runtime', severity: 'critical' };
  assert.equal(shouldFail('library', [crit]), true);
  assert.equal(shouldFail('library', [{ scope: 'dev', severity: 'critical' }]), false);
  assert.equal(shouldFail('library', [{ scope: 'runtime', severity: 'medium' }]), false);
  assert.equal(shouldFail('toolbox', [crit]), false);
  assert.equal(shouldFail('website', [crit]), false);
});

test('allowlist suppression by GHSA and by CVE alias', () => {
  const findings = buildFindings('library', report, lock, [{ name: 'packages/lib', path: 'packages/lib' }]);
  const byGhsa = applyAllowlist(findings, [{ id: 'GHSA-cccc-cccc-cccc', reason: 'accepted' }]);
  assert.equal(byGhsa.active.length, 1);
  assert.equal(byGhsa.suppressed[0].suppressedReason, 'accepted');

  const entries = [{ id: 'CVE-2024-0001', reason: 'fp' }];
  const withAlias = addCveAliases(findings, entries, ghsa => (ghsa === 'GHSA-2222-3333-4444' ? ['CVE-2024-0001'] : []));
  const byCve = applyAllowlist(withAlias, entries);
  assert.deepEqual(
    byCve.suppressed.map(f => f.package),
    ['vulnlib']
  );
});

test('CVE lookup is skipped when the allowlist only has GHSA entries', () => {
  let calls = 0;
  const findings = buildFindings('library', report, lock, [{ name: 'packages/lib', path: 'packages/lib' }]);
  addCveAliases(findings, [{ id: 'GHSA-cccc-cccc-cccc', reason: 'x' }], () => {
    calls++;
    return [];
  });
  assert.equal(calls, 0);
});

test('tier mapping', () => {
  assert.equal(tierOfWorkspace('packages/fdc3-schema'), 'library');
  assert.equal(tierOfWorkspace('toolbox/fdc3-for-web/fdc3-web-impl'), 'library');
  assert.equal(tierOfWorkspace('toolbox/fdc3-workbench'), 'toolbox');
  assert.equal(normaliseSeverity('moderate'), 'medium');
  const pkg = { workspaces: ['packages/a', 'toolbox/fdc3-for-web/fdc3-web-impl', 'toolbox/x'] };
  assert.deepEqual(
    rootsFor('library', pkg).map(r => r.name),
    ['packages/a', 'toolbox/fdc3-for-web/fdc3-web-impl']
  );
  assert.deepEqual(
    rootsFor('toolbox', pkg).map(r => r.name),
    ['toolbox/x', '(root)']
  );
  assert.equal(rootsFor('website', pkg)[0].lockDir, 'website');
});
