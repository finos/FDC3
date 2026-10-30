// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

/**
 * Renders the findings-<tier>.json files produced by the scanners as a markdown report.
 *
 *   node scripts/cve/report.mjs [findings-dir]
 *
 * Writes to $GITHUB_STEP_SUMMARY when set, otherwise to stdout.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAIL_SEVERITIES } from './npm-audit.mjs';

export const TIERS = [
  { id: 'library', label: 'Library packages', policy: 'Fails on high/critical runtime; everything else is reported' },
  { id: 'toolbox', label: 'Toolbox', policy: 'Reported only' },
  { id: 'website', label: 'Website', policy: 'Informational (separate project)' },
  { id: 'actions', label: 'GitHub Actions', policy: 'Reported only' },
];
export const SEVERITIES = ['critical', 'high', 'medium', 'low'];
const SEVERITY_ICON = { critical: '🔴', high: '🟠', medium: '🟡', low: '⚪' };

/** Reads every findings-*.json under `dir` (recursively, as download-artifact nests them). */
export function loadResults(dir) {
  const results = {};
  const visit = d => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) visit(full);
      else if (/^findings-.+\.json$/.test(entry.name)) {
        const data = JSON.parse(fs.readFileSync(full, 'utf8'));
        const existing = results[data.tier];
        // Several scanners can report on one tier (e.g. npm audit + Sonatype): combine them.
        results[data.tier] = existing
          ? {
              ...existing,
              findings: [...existing.findings, ...data.findings],
              suppressed: [...existing.suppressed, ...(data.suppressed ?? [])],
            }
          : { ...data, suppressed: data.suppressed ?? [] };
      }
    }
  };
  if (fs.existsSync(dir)) visit(dir);
  return results;
}

/**
 * Merges findings reported by different scanners for the same advisory.
 * Two findings match when they are for the same package and share an advisory ID.
 */
export function mergeFindings(findings) {
  const merged = [];
  for (const f of findings) {
    const match = merged.find(
      m =>
        m.package === f.package &&
        m.scope === f.scope &&
        f.ids.some(id => m.ids.map(i => i.toLowerCase()).includes(id.toLowerCase()))
    );
    if (!match) {
      merged.push({ ...f, sources: [f.source], ids: [...f.ids], workspace: [...(f.workspace ?? [])] });
      continue;
    }
    for (const id of f.ids) if (!match.ids.some(i => i.toLowerCase() === id.toLowerCase())) match.ids.push(id);
    for (const w of f.workspace ?? []) if (!match.workspace.includes(w)) match.workspace.push(w);
    if (!match.sources.includes(f.source)) match.sources.push(f.source);
    match.fixAvailable = match.fixAvailable || f.fixAvailable;
  }
  return merged;
}

export function fixText(f) {
  if (!f.fixAvailable) return 'no fix';
  const v = f.fixVersion ? ` (${f.fixVersion})` : '';
  return f.fixIsMajor ? `major bump${v}` : `fix available${v}`;
}

const esc = s =>
  String(s ?? '')
    // Escape backslashes first, otherwise a title containing `\|` would turn into `\\|`,
    // leaving the pipe unescaped and breaking out of the table cell.
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ');

export function countBy(findings) {
  const counts = { runtime: {}, dev: {}, other: {} };
  for (const f of findings) {
    const bucket = counts[f.scope] ?? counts.other;
    bucket[f.severity] = (bucket[f.severity] ?? 0) + 1;
  }
  return counts;
}

export function tierStatus(tier, result) {
  if (!result) return '⚠️ no results (job failed?)';
  const active = result.findings;
  if (tier === 'library' && active.some(f => f.scope === 'runtime' && FAIL_SEVERITIES.includes(f.severity))) {
    return '❌ failing';
  }
  return active.length ? '⚠️ findings' : '✅ clean';
}

function summariseCounts(findings, scope) {
  const subset = findings.filter(typeof scope === 'function' ? scope : f => f.scope === scope);
  if (!subset.length) return '0';
  return SEVERITIES.filter(s => subset.some(f => f.severity === s))
    .map(s => `${SEVERITY_ICON[s]} ${subset.filter(f => f.severity === s).length} ${s}`)
    .join(', ');
}

export function renderOverview(results) {
  const rows = TIERS.map(t => {
    const r = results[t.id];
    const merged = r ? mergeFindings(r.findings) : [];
    // Workflow findings have no runtime/dev split: show them all in the first column.
    const workflow = t.id === 'actions';
    const first = !r ? '-' : workflow ? summariseCounts(merged, () => true) : summariseCounts(merged, 'runtime');
    const second = !r || workflow ? '-' : summariseCounts(merged, 'dev');
    return `| ${t.label} | ${tierStatus(t.id, r)} | ${first} | ${second} | ${t.policy} |`;
  });
  return ['| Area | Status | Runtime | Dev | Policy |', '| --- | --- | --- | --- | --- |', ...rows].join('\n');
}

/** Renders the detail section for one tier; also used as the body of its tracking issue. */
export function renderTier(tier, result) {
  const meta = TIERS.find(t => t.id === tier);
  const lines = [`### ${meta?.label ?? tier}`, ''];
  if (!result) return [...lines, '_No results were produced for this area. Check the scan job._', ''].join('\n');

  const findings = mergeFindings(result.findings);
  if (!findings.length) {
    lines.push('No unsuppressed vulnerabilities found.', '');
  } else {
    const multiSource = findings.some(f => f.sources.length > 1 || f.sources[0] !== 'npm-audit');
    lines.push(
      `| Severity | Scope | Package | Advisory | Affected | Fix |${multiSource ? ' Source |' : ''}`,
      `| --- | --- | --- | --- | --- | --- |${multiSource ? ' --- |' : ''}`
    );
    for (const f of findings) {
      const id = f.ids[0] ? (f.url ? `[${f.ids[0]}](${f.url})` : f.ids[0]) : f.url ? `[advisory](${f.url})` : '-';
      const where = (f.workspace ?? []).length ? f.workspace.map(w => `\`${w}\``).join(', ') : '-';
      lines.push(
        `| ${SEVERITY_ICON[f.severity] ?? ''} ${f.severity} | ${f.scope} | \`${esc(f.package)}\`${
          f.version ? ` ${esc(f.version)}` : ''
        } | ${id}: ${esc(f.title)} | ${where} | ${fixText(f)} |${multiSource ? ` ${f.sources.join(' + ')} |` : ''}`
      );
    }
    lines.push('');
  }

  if (result.suppressed.length) {
    lines.push(
      `<details><summary>${result.suppressed.length} suppressed by allow-list.json</summary>`,
      '',
      ...result.suppressed.map(
        f => `- \`${esc(f.package)}\` ${f.ids[0] ?? ''} (${f.suppressedBy}): ${esc(f.suppressedReason)}`
      ),
      '',
      '</details>',
      ''
    );
  }
  if (result.generatedAt) lines.push(`_Scanned ${result.generatedAt}_`, '');
  return lines.join('\n');
}

export function renderReport(results) {
  const parts = ['## CVE scan summary', '', renderOverview(results), ''];
  for (const t of TIERS) {
    if (results[t.id] || t.id === 'library') parts.push(renderTier(t.id, results[t.id]));
  }
  return parts.join('\n');
}

function main(argv) {
  const dir = argv[2] ?? '.';
  const md = renderReport(loadResults(dir));
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');
  else console.log(md);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv);
}
