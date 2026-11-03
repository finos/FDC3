// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

/**
 * Normalises `auditjs guide --json` output (Sonatype Guide) into the shared findings format.
 *
 *   auditjs guide --json ... > sonatype-raw.json
 *   node scripts/cve/sonatype.mjs sonatype-raw.json
 *
 * AuditJS scans the runtime dependencies of the whole repo (no --dev). We attribute each
 * component to a tier using lockfile reachability: anything the library workspaces pull in at
 * runtime is "library"; the rest is "toolbox". Writes findings-library-sonatype.json and
 * findings-toolbox-sonatype.json. Exits 1 when the library tier has unsuppressed high/critical
 * runtime findings and 2 when the AuditJS output is unusable (e.g. authentication failure).
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

/** @returns {{library: object[], toolbox: object[]}} */
export function buildSonatypeFindings(results, lock, rootPackageJson) {
  const libraryRoots = rootsFor('library', rootPackageJson).map(r => ({
    name: r.name,
    ...reachableFrom(lock, r.path),
  }));
  const toolboxRoots = rootsFor('toolbox', rootPackageJson).map(r => ({
    name: r.name,
    ...reachableFrom(lock, r.path),
  }));
  const out = { library: [], toolbox: [] };

  for (const result of results) {
    const component = parsePurl(result.coordinates);
    if (!component || !result.vulnerabilities?.length) continue;
    const paths = lockPathsFor(lock, component.name, component.version);
    const libHits = libraryRoots.filter(r => paths.some(p => r.runtime.has(p)));
    const tier = libHits.length ? 'library' : 'toolbox';
    const hits = libHits.length ? libHits : toolboxRoots.filter(r => paths.some(p => r.runtime.has(p)));

    for (const v of result.vulnerabilities) {
      out[tier].push({
        tier,
        scope: 'runtime',
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
