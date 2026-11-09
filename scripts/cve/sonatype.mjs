// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

/**
 * Normalises `auditjs guide --json` output (Sonatype Guide) into the shared findings format.
 *
 *   auditjs guide --json ... > sonatype-raw.json
 *   node scripts/cve/sonatype.mjs sonatype-raw.json
 *
 * AuditJS must be run with --dev: it reads the root package's installed dependency tree
 * (read-installed) and does not understand npm workspaces, so without --dev it sees only the
 * root's own runtime dependencies, which are none, and scans nothing. With --dev it sees every
 * installed package. We then attribute each component to a tier and to runtime/dev scope using
 * lockfile reachability (see lockfile.mjs): reachable at runtime from the library workspaces ->
 * library/runtime; else from the toolbox workspaces -> toolbox/runtime; else dev in the library or
 * toolbox tier. Writes findings-library-sonatype.json and findings-toolbox-sonatype.json.
 *
 * Exits 1 when the library tier has unsuppressed high/critical runtime findings, and 2 when the
 * AuditJS output is unusable: unparseable, empty, or not covering the library's runtime
 * dependencies (a scan that checks nothing must never look clean).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reachableFrom } from './lockfile.mjs';
import { REPO_ROOT, rootsFor, applyAllowlist, shouldFail } from './npm-audit.mjs';
import { loadAllowlist } from './allowlist.mjs';

/** AuditJS may print progress text around the JSON array; take the outermost [...] block. */
export function parseAuditJsOutput(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end < start) throw new Error('AuditJS output did not contain a JSON array');
  const parsed = JSON.parse(text.slice(start, end + 1));
  if (!Array.isArray(parsed)) throw new Error('AuditJS output was not an array');
  return parsed;
}

export function severityFromCvss(score) {
  const n = Number.parseFloat(score);
  if (Number.isNaN(n) || n <= 0) return 'low';
  if (n >= 9) return 'critical';
  if (n >= 7) return 'high';
  if (n >= 4) return 'medium';
  return 'low';
}

/** "pkg:npm/%40scope/name@1.2.3" -> { name: "@scope/name", version: "1.2.3" } */
export function parsePurl(purl) {
  const m = /^pkg:npm\/(.+)@([^@?#]+)/.exec(purl ?? '');
  if (!m) return null;
  return { name: decodeURIComponent(m[1]), version: m[2] };
}

/** Lockfile paths for an exact name@version (a package can be installed at several depths). */
function lockPathsFor(lock, name, version) {
  return Object.entries(lock.packages ?? {})
    .filter(([p, e]) => e.version === version && (p === `node_modules/${name}` || p.endsWith(`/node_modules/${name}`)))
    .map(([p]) => p);
}

function rootsWithReach(tier, lock, rootPackageJson) {
  return rootsFor(tier, rootPackageJson).map(r => ({ name: r.name, ...reachableFrom(lock, r.path) }));
}

/**
 * How much of the library's runtime dependency set the scan covered.
 * @returns {{ total: number, covered: number }} lock entries reachable at runtime from the library
 *   workspaces, and how many of those appear (by name@version) in the scan results.
 */
export function libraryRuntimeCoverage(results, lock, rootPackageJson) {
  const scanned = new Set(
    results
      .map(r => parsePurl(r.coordinates))
      .filter(Boolean)
      .map(c => `${c.name}@${c.version}`)
  );
  const runtime = new Set();
  for (const root of rootsWithReach('library', lock, rootPackageJson)) {
    for (const p of root.runtime) runtime.add(p);
  }
  // Installed third-party packages only: skip workspace directories (no node_modules/ in the path) and links.
  const external = [...runtime].filter(
    p => p.includes('node_modules/') && lock.packages?.[p]?.version && !lock.packages[p].link
  );
  const covered = external.filter(p => scanned.has(`${nameOfLockPath(p)}@${lock.packages[p].version}`)).length;
  return { total: external.length, covered };
}

function nameOfLockPath(lockPath) {
  return lockPath.slice(lockPath.lastIndexOf('node_modules/') + 'node_modules/'.length);
}

/** @returns {{library: object[], toolbox: object[]}} */
export function buildSonatypeFindings(results, lock, rootPackageJson) {
  const libraryRoots = rootsWithReach('library', lock, rootPackageJson);
  const toolboxRoots = rootsWithReach('toolbox', lock, rootPackageJson);
  const out = { library: [], toolbox: [] };

  /** First matching bucket wins: runtime beats dev, library beats toolbox. */
  const classify = paths => {
    const reaching = (roots, set) => roots.filter(r => paths.some(p => r[set].has(p)));
    for (const [tier, roots] of [
      ['library', libraryRoots],
      ['toolbox', toolboxRoots],
    ]) {
      const hits = reaching(roots, 'runtime');
      if (hits.length) return { tier, scope: 'runtime', hits };
    }
    for (const [tier, roots] of [
      ['library', libraryRoots],
      ['toolbox', toolboxRoots],
    ]) {
      const hits = reaching(roots, 'all');
      if (hits.length) return { tier, scope: 'dev', hits };
    }
    return { tier: 'toolbox', scope: 'dev', hits: [] }; // installed but not reachable from any workspace
  };

  for (const result of results) {
    const component = parsePurl(result.coordinates);
    if (!component || !result.vulnerabilities?.length) continue;
    const { tier, scope, hits } = classify(lockPathsFor(lock, component.name, component.version));

    for (const v of result.vulnerabilities) {
      out[tier].push({
        tier,
        scope,
        workspace: hits.map(h => h.name),
        package: component.name,
        version: component.version,
        severity: severityFromCvss(v.cvssScore),
        ids: [v.cve, v.id].filter(Boolean),
        title: v.title,
        url: v.reference || result.reference,
        // Sonatype's scan output does not say whether a fix exists.
        fixAvailable: false,
        fixIsMajor: false,
        source: 'sonatype',
      });
    }
  }
  return out;
}

function main(argv) {
  const rawFile = argv[2];
  if (!rawFile) throw new Error('usage: sonatype.mjs <auditjs-json-output>');
  let results;
  try {
    results = parseAuditJsOutput(fs.readFileSync(rawFile, 'utf8'));
  } catch (err) {
    console.error(`::error::Sonatype scan produced no usable results: ${err.message}`);
    process.exit(2);
  }
  const rootPkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));
  const lock = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package-lock.json'), 'utf8'));
  const entries = loadAllowlist();

  // Guard against a scan that silently checked nothing (see header comment).
  const { total, covered } = libraryRuntimeCoverage(results, lock, rootPkg);
  console.log(
    `sonatype scanned ${results.length} components, covering ${covered} of ${total} library runtime dependencies`
  );
  if (results.length === 0 || (total > 0 && covered === 0)) {
    console.error(
      '::error::Sonatype scan did not cover the library runtime dependencies. AuditJS must run with --dev from the repo root after npm ci.'
    );
    process.exit(2);
  }
  const byTier = buildSonatypeFindings(results, lock, rootPkg);

  let fail = false;
  for (const tier of ['library', 'toolbox']) {
    const { active, suppressed } = applyAllowlist(byTier[tier], entries);
    fs.writeFileSync(
      `findings-${tier}-sonatype.json`,
      JSON.stringify({ tier, generatedAt: new Date().toISOString(), findings: active, suppressed }, null, 2)
    );
    console.log(`sonatype ${tier}: ${active.length} findings, ${suppressed.length} suppressed`);
    fail ||= shouldFail(tier, active);
  }
  if (fail) {
    console.error('::error::Sonatype reports unsuppressed high/critical runtime vulnerabilities in the library tier');
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
