// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

/**
 * Maintains one tracking issue per scanned area (never one per CVE).
 *
 *   node scripts/cve/issues.mjs <findings-dir> [--dry-run]
 *
 * For each area with scan results:
 *   - findings and no open issue  -> create the issue
 *   - findings and an open issue  -> update it in place, only if the content changed
 *   - no findings and open issue  -> comment and close it
 * Areas with no results (the scan job failed) are left alone, so a broken scan never closes an issue.
 *
 * Issues are found by label (`cve-scan:<tier>`) plus a hidden marker in the body. Requires `gh`
 * with GH_TOKEN and `issues: write`; run only from trusted (non-PR) workflow runs.
 */

import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { TIERS, loadResults, mergeFindings, renderTier } from './report.mjs';

export const BASE_LABEL = 'cve-scan';
const MAX_BODY = 60000; // GitHub's limit is 65536 characters

export const marker = tier => `<!-- cve-scan:${tier} -->`;
export const tierLabel = tier => `${BASE_LABEL}:${tier}`;

/** Deterministic body (no timestamps) so an unchanged scan produces no issue edit. */
export function buildBody(tier, result, repo = process.env.GITHUB_REPOSITORY) {
  const meta = TIERS.find(t => t.id === tier);
  const workflow = repo ? `https://github.com/${repo}/actions/workflows/cve-scanning.yml` : 'the CVE scanning workflow';
  const detail = renderTier(tier, result)
    .replace(/^_Scanned .*_$/m, '')
    .trimEnd();
  let body = [
    marker(tier),
    `Tracking issue for vulnerabilities found in **${meta?.label ?? tier}** (${meta?.policy ?? ''}).`,
    'It is updated automatically by the nightly CVE scan and closed when the area is clean. To accept a risk, add an entry with a reason (and ideally an expiry date) to `allow-list.json`.',
    '',
    detail,
    '',
    `Latest results: [CVE scanning workflow](${workflow}).`,
  ].join('\n');
  if (body.length > MAX_BODY) {
    body = `${body.slice(0, MAX_BODY)}\n\n_Truncated. See the workflow run summary for the full list._`;
  }
  return body;
}

export function buildTitle(tier, count) {
  const meta = TIERS.find(t => t.id === tier);
  return `CVE scan: ${meta?.label ?? tier} has ${count} open finding${count === 1 ? '' : 's'}`;
}

/**
 * Decides what to do for one area.
 * @param existing the open tracking issue ({number, title, body}) or undefined
 */
export function decide(tier, result, existing, repo) {
  if (!result) return { action: 'none', reason: 'no scan results (scan job failed?)' };
  const count = mergeFindings(result.findings).length;
  if (count === 0) {
    return existing ? { action: 'close', number: existing.number } : { action: 'none', reason: 'clean' };
  }
  const title = buildTitle(tier, count);
  const body = buildBody(tier, result, repo);
  if (!existing) return { action: 'create', title, body };
  if (existing.title === title && (existing.body ?? '').trim() === body.trim()) {
    return { action: 'none', reason: 'unchanged' };
  }
  return { action: 'update', number: existing.number, title, body };
}

/** Default `gh` runner. Arguments are passed as an array (no shell), body via stdin. */
export function runGh(args, input) {
  const res = spawnSync('gh', args, { encoding: 'utf8', input });
  if (res.status !== 0) throw new Error(`gh ${args.slice(0, 2).join(' ')} failed: ${res.stderr || res.stdout}`);
  return res.stdout;
}

export function findOpenIssue(tier, gh = runGh) {
  const out = gh([
    'issue',
    'list',
    '--label',
    tierLabel(tier),
    '--state',
    'open',
    '--json',
    'number,title,body',
    '--limit',
    '20',
  ]);
  return JSON.parse(out || '[]').find(i => (i.body ?? '').includes(marker(tier)));
}

export function applyDecision(tier, decision, { gh = runGh, dryRun = false } = {}) {
  const log = msg => console.log(`${tier}: ${msg}`);
  switch (decision.action) {
    case 'none':
      log(`no change (${decision.reason})`);
      return;
    case 'create':
      if (dryRun) return log(`would create issue "${decision.title}"`);
      for (const label of [BASE_LABEL, tierLabel(tier)]) {
        gh(['label', 'create', label, '--force', '--color', 'B60205', '--description', 'Automated CVE scan tracking']);
      }
      gh(
        [
          'issue',
          'create',
          '--title',
          decision.title,
          '--label',
          BASE_LABEL,
          '--label',
          tierLabel(tier),
          '--body-file',
          '-',
        ],
        decision.body
      );
      return log('created issue');
    case 'update':
      if (dryRun) return log(`would update issue #${decision.number}`);
      gh(['issue', 'edit', String(decision.number), '--title', decision.title, '--body-file', '-'], decision.body);
      return log(`updated issue #${decision.number}`);
    case 'close':
      if (dryRun) return log(`would close issue #${decision.number}`);
      gh([
        'issue',
        'close',
        String(decision.number),
        '--comment',
        'The latest scan found no unsuppressed vulnerabilities in this area. Closing automatically.',
      ]);
      return log(`closed issue #${decision.number}`);
  }
}

function main(argv) {
  const dir = argv[2];
  if (!dir) throw new Error('usage: issues.mjs <findings-dir> [--dry-run]');
  const dryRun = argv.includes('--dry-run');
  const results = loadResults(dir);
  for (const { id } of TIERS) {
    const result = results[id];
    // In a dry run there may be no token, so only look up existing issues when we can.
    let existing;
    if (result && !(dryRun && !process.env.GH_TOKEN)) existing = findOpenIssue(id);
    applyDecision(id, decide(id, result, existing, process.env.GITHUB_REPOSITORY), { dryRun });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(process.argv);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
