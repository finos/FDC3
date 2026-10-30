// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

/**
 * Normalises `zizmor --format=json` output (GitHub Actions workflow analysis) into the shared
 * findings format for the "actions" tier.
 *
 *   zizmor --format=json .github > zizmor-raw.json
 *   node scripts/cve/zizmor.mjs zizmor-raw.json
 *
 * - `known-vulnerable-actions` findings are vulnerabilities in an action we use (advisory-backed).
 *   Dependabot alerts do not cover SHA-pinned actions, so this is the only check for them.
 * - Every other audit is a workflow hardening finding (excessive permissions, template injection, ...).
 *   They are grouped per audit across files so the report stays readable.
 *
 * The actions tier is reported only; it never fails the run. Advisory-backed findings honour the
 * shared allow-list.json (by GHSA ID).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyAllowlist } from './npm-audit.mjs';
import { loadAllowlist } from './allowlist.mjs';

const SEVERITY = { informational: 'low', low: 'low', medium: 'medium', high: 'high', unknown: 'medium' };
const ORDER = ['low', 'medium', 'high', 'critical'];

export function parseZizmorOutput(text) {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error('zizmor output was not a JSON array');
  return parsed;
}

/** Workflow file a location points at (the key shape differs slightly between zizmor versions). */
export function locationPath(location) {
  const local = location?.symbolic?.key?.Local;
  return local?.given_path ?? local?.verbatim_path ?? undefined;
}

const ghsaIn = text => /GHSA(-[23456789cfghjmpqrvwx]{4}){3}/i.exec(text ?? '')?.[0];

export function buildActionsFindings(raw) {
  const groups = new Map();

  for (const f of raw) {
    if (f.ignored) continue;
    const severity = SEVERITY[String(f.determinations?.severity ?? 'unknown').toLowerCase()] ?? 'medium';
    const files = [...new Set((f.locations ?? []).map(locationPath).filter(Boolean))];
    const primary = (f.locations ?? []).find(l => l.symbolic?.kind === 'Primary') ?? f.locations?.[0];
    const annotation = primary?.symbolic?.annotation ?? '';
    const vulnerable = f.ident === 'known-vulnerable-actions';

    let key;
    let finding;
    if (vulnerable) {
      const action = /uses:\s*([^\s#]+)/.exec(primary?.concrete?.feature ?? '')?.[1] ?? 'unknown action';
      const name = action.replace(/@.*$/, '');
      const ghsa = ghsaIn(annotation) ?? ghsaIn(f.desc);
      key = `vuln:${name}:${ghsa ?? annotation}`;
      finding = {
        package: name,
        version: action.includes('@') ? action.split('@')[1].slice(0, 12) : '',
        ids: ghsa ? [ghsa] : [],
        title: annotation || f.desc,
        // Fix details are in the advisory; zizmor does not give a patched version.
        fixAvailable: true,
        kind: 'vulnerability',
      };
    } else {
      key = `hardening:${f.ident}`;
      finding = { package: f.ident, version: '', ids: [], title: f.desc, fixAvailable: true, kind: 'hardening' };
    }

    const existing = groups.get(key);
    if (existing) {
      for (const file of files) if (!existing.workspace.includes(file)) existing.workspace.push(file);
      if (ORDER.indexOf(severity) > ORDER.indexOf(existing.severity)) existing.severity = severity;
    } else {
      groups.set(key, {
        tier: 'actions',
        scope: 'workflow',
        workspace: files,
        severity,
        url: f.url,
        fixIsMajor: false,
        source: 'zizmor',
        ...finding,
      });
    }
  }

  return [...groups.values()].sort(
    (a, b) =>
      (a.kind === 'vulnerability' ? 0 : 1) - (b.kind === 'vulnerability' ? 0 : 1) ||
      ORDER.indexOf(b.severity) - ORDER.indexOf(a.severity) ||
      a.package.localeCompare(b.package)
  );
}

function main(argv) {
  const rawFile = argv[2];
  if (!rawFile) throw new Error('usage: zizmor.mjs <zizmor-json-output> [out-file]');
  const out = argv[3] ?? 'findings-actions.json';
  let raw;
  try {
    raw = parseZizmorOutput(fs.readFileSync(rawFile, 'utf8'));
  } catch (err) {
    console.error(`::error::zizmor produced no usable results: ${err.message}`);
    process.exit(2);
  }
  const { active, suppressed } = applyAllowlist(buildActionsFindings(raw), loadAllowlist());
  fs.writeFileSync(
    out,
    JSON.stringify({ tier: 'actions', generatedAt: new Date().toISOString(), findings: active, suppressed }, null, 2)
  );
  const vulns = active.filter(f => f.kind === 'vulnerability').length;
  console.log(`actions: ${vulns} vulnerable actions, ${active.length - vulns} hardening findings -> ${out}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv);
  } catch (err) {
    console.error(err.message);
    process.exit(2);
  }
}
