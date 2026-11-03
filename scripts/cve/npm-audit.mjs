// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

/**
 * Tiered npm audit.
 *
 * Runs `npm audit` once over a lockfile, then attributes each advisory to a tier and to runtime/dev
 * scope using lockfile reachability (see lockfile.mjs), and writes normalised findings.
 *
 *   node scripts/cve/npm-audit.mjs --tier library|toolbox|website [--out findings-<tier>.json]
 *
 * Exits 1 only when the library tier has unsuppressed high/critical *runtime* findings.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { reachableFrom } from './lockfile.mjs';
import { loadAllowlist, findSuppression, activeEntries } from './allowlist.mjs';

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Workspaces in the library tier besides packages/*: published to npm, so downstream apps depend on it. */
const LIBRARY_EXTRAS = ['toolbox/fdc3-for-web/fdc3-web-impl'];
export const FAIL_SEVERITIES = ['high', 'critical'];
const SEVERITY_ORDER = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };

export function tierOfWorkspace(dir) {
  if (dir === 'website') return 'website';
  if (dir.startsWith('packages/') || LIBRARY_EXTRAS.includes(dir)) return 'library';
  return 'toolbox';
}

export function normaliseSeverity(s) {
  return s === 'moderate' ? 'medium' : (s ?? 'info');
}

/**
 * Roots (workspaces) for a lockfile and the tier each belongs to.
 * The root project itself (dev tooling only) is reported under the toolbox tier as "(root)".
 */
export function rootsFor(tier, rootPackageJson) {
  if (tier === 'website') return [{ name: 'website', path: '', lockDir: 'website' }];
  const dirs = rootPackageJson.workspaces ?? [];
  const roots = dirs.map(dir => ({ name: dir, path: dir, lockDir: '.' }));
  roots.push({ name: '(root)', path: '', lockDir: '.' });
  return roots.filter(r => tierOfWorkspace(r.name === '(root)' ? 'tooling' : r.name) === tier);
}

/** Pulls the direct advisories (the `via` objects) out of an `npm audit --json` report. */
export function advisoriesOf(auditReport) {
  const out = [];
  for (const vuln of Object.values(auditReport.vulnerabilities ?? {})) {
    for (const via of vuln.via ?? []) {
      if (typeof via === 'string') continue;
      out.push({ vuln, advisory: via });
    }
  }
  return out;
}

function fixInfo(fixAvailable) {
  if (fixAvailable && typeof fixAvailable === 'object') {
    return {
      fixAvailable: true,
      fixIsMajor: !!fixAvailable.isSemVerMajor,
      // npm may resolve the fix by bumping a parent package (e.g. a framework) rather than the vulnerable one.
      fixVersion: fixAvailable.name ? `${fixAvailable.name}@${fixAvailable.version}` : fixAvailable.version,
    };
  }
  return { fixAvailable: !!fixAvailable, fixIsMajor: false };
}

function ghsaOf(advisory) {
  return /GHSA(-[23456789cfghjmpqrvwx]{4}){3}/i.exec(advisory.url ?? '')?.[0];
}

/**
 * Builds normalised findings for a tier.
 * @param {object} auditReport  `npm audit --json` output for the lockfile
 * @param {object} lock         parsed package-lock.json
 * @param {Array<{name:string,path:string}>} roots workspaces belonging to the tier
 */
export function buildFindings(tier, auditReport, lock, roots, versionOf = p => lock.packages?.[p]?.version) {
  const reach = roots.map(r => ({ name: r.name, ...reachableFrom(lock, r.path) }));
  const byAdvisory = new Map();

  for (const { vuln, advisory } of advisoriesOf(auditReport)) {
    const ghsa = ghsaOf(advisory);
    const key = `${advisory.name}:${ghsa ?? advisory.source}`;
    for (const node of vuln.nodes ?? []) {
      const touching = reach.filter(r => r.all.has(node));
      if (!touching.length) continue; // belongs to another tier
      const runtime = touching.some(r => r.runtime.has(node));
      let f = byAdvisory.get(key);
      if (!f) {
        f = {
          tier,
          scope: 'dev',
          workspace: [],
          package: advisory.name,
          versions: [],
          severity: normaliseSeverity(advisory.severity),
          ids: ghsa ? [ghsa] : [],
          title: advisory.title,
          url: advisory.url,
          ...fixInfo(vuln.fixAvailable),
          source: 'npm-audit',
        };
        byAdvisory.set(key, f);
      }
      if (runtime) f.scope = 'runtime';
      for (const r of touching) if (!f.workspace.includes(r.name)) f.workspace.push(r.name);
      const v = versionOf(node);
      if (v && !f.versions.includes(v)) f.versions.push(v);
    }
  }

  return [...byAdvisory.values()]
    .map(({ versions, ...f }) => ({ ...f, version: versions.join(', ') }))
    .sort(
      (a, b) =>
        SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity] ||
        a.package.localeCompare(b.package) ||
        a.ids[0]?.localeCompare(b.ids[0] ?? '')
    );
}

/** Splits findings into active and suppressed using the allowlist. */
export function applyAllowlist(findings, entries, now = new Date()) {
  const active = [];
  const suppressed = [];
  for (const f of findings) {
    const hit = findSuppression(f, entries, now);
    if (hit) suppressed.push({ ...f, suppressedBy: hit.id, suppressedReason: hit.reason });
    else active.push(f);
  }
  return { active, suppressed };
}

/** Does this tier's result fail the build? Only the library tier, only runtime high/critical. */
export function shouldFail(tier, activeFindings) {
  return tier === 'library' && activeFindings.some(f => f.scope === 'runtime' && FAIL_SEVERITIES.includes(f.severity));
}

/** Looks up CVE aliases for GHSA IDs via the GitHub API so CVE-based allowlist entries can match. */
export function resolveCveAliases(ghsa) {
  const res = spawnSync('gh', ['api', `/advisories/${ghsa}`, '--jq', '.cve_id // empty'], { encoding: 'utf8' });
  const cve = res.status === 0 ? res.stdout.trim() : '';
  return cve ? [cve] : [];
}

/** Adds CVE IDs to findings, but only when the allowlist actually contains non-GHSA entries. */
export function addCveAliases(findings, entries, lookup = resolveCveAliases) {
  if (!activeEntries(entries).some(e => !/^GHSA/i.test(e.id))) return findings;
  const cache = new Map();
  return findings.map(f => {
    const extra = f.ids
      .filter(id => /^GHSA/i.test(id))
      .flatMap(id => {
        if (!cache.has(id)) cache.set(id, lookup(id));
        return cache.get(id);
      });
    return { ...f, ids: [...new Set([...f.ids, ...extra])] };
  });
}

function runAudit(cwd) {
  // npm audit exits non-zero when it finds vulnerabilities; the JSON on stdout is still valid.
  const res = spawnSync('npm', ['audit', '--json', '--package-lock-only'], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  });
  try {
    return JSON.parse(res.stdout);
  } catch {
    throw new Error(`npm audit did not return JSON in ${cwd}: ${res.stderr || res.stdout}`);
  }
}

function main(argv) {
  const arg = name => {
    const i = argv.indexOf(name);
    return i === -1 ? undefined : argv[i + 1];
  };
  const tier = arg('--tier');
  if (!['library', 'toolbox', 'website'].includes(tier)) {
    throw new Error('usage: npm-audit.mjs --tier library|toolbox|website [--out file]');
  }
  const out = arg('--out') ?? `findings-${tier}.json`;
  const rootPkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
  const roots = rootsFor(tier, rootPkg);
  const lockDir = path.join(REPO_ROOT, roots[0].lockDir);
  const lock = JSON.parse(fs.readFileSync(path.join(lockDir, 'package-lock.json'), 'utf8'));
  const entries = loadAllowlist();

  const report = runAudit(lockDir);
  const findings = addCveAliases(buildFindings(tier, report, lock, roots), entries);
  const { active, suppressed } = applyAllowlist(findings, entries);

  fs.writeFileSync(
    out,
    JSON.stringify({ tier, generatedAt: new Date().toISOString(), findings: active, suppressed }, null, 2)
  );
  const runtime = active.filter(f => f.scope === 'runtime').length;
  console.log(
    `${tier}: ${active.length} findings (${runtime} runtime, ${active.length - runtime} dev), ${suppressed.length} suppressed -> ${out}`
  );
  if (shouldFail(tier, active)) {
    console.error(`::error::Library tier has unsuppressed high/critical runtime vulnerabilities`);
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv);
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }
}
