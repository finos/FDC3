// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

/**
 * Shared CVE allowlist handling.
 *
 * Entries live in `allow-list.json` at the repo root:
 *   { "ignore": [{ "id": "CVE-...|GHSA-...", "reason": "...", "ghsa"?: "GHSA-...", "expires"?: "YYYY-MM-DD" }] }
 *
 * The same file is consumed by AuditJS (which only understands `id` and `reason`),
 * by our npm audit normaliser, and by dependency-review-action (GHSA IDs).
 * Entries with a past `expires` date no longer suppress anything.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ID_PATTERN = /^(CVE-\d{4}-\d{4,}|GHSA(-[23456789cfghjmpqrvwx]{4}){3}|sonatype-\d{4}-\d+)$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const DEFAULT_ALLOWLIST_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../allow-list.json'
);

/** Validates a parsed allowlist, throwing an Error describing every problem found. */
export function validateAllowlist(data) {
  const problems = [];
  if (!data || typeof data !== 'object' || !Array.isArray(data.ignore)) {
    throw new Error('allow-list.json must be an object with an "ignore" array');
  }
  data.ignore.forEach((entry, i) => {
    const where = `ignore[${i}]`;
    if (!entry || typeof entry !== 'object') {
      problems.push(`${where}: must be an object`);
      return;
    }
    if (typeof entry.id !== 'string' || !ID_PATTERN.test(entry.id)) {
      problems.push(`${where}: "id" must be a CVE, GHSA or sonatype ID`);
    }
    if (typeof entry.reason !== 'string' || entry.reason.trim() === '') {
      problems.push(`${where}: "reason" is required`);
    }
    if (entry.ghsa !== undefined && !/^GHSA(-[23456789cfghjmpqrvwx]{4}){3}$/i.test(entry.ghsa)) {
      problems.push(`${where}: "ghsa" must be a GHSA ID`);
    }
    if (entry.expires !== undefined) {
      if (typeof entry.expires !== 'string' || !DATE_PATTERN.test(entry.expires) || isNaN(Date.parse(entry.expires))) {
        problems.push(`${where}: "expires" must be a YYYY-MM-DD date`);
      }
    }
  });
  if (problems.length) {
    throw new Error(`Invalid allow-list.json:\n  ${problems.join('\n  ')}`);
  }
  return data.ignore;
}

export function loadAllowlist(file = DEFAULT_ALLOWLIST_PATH) {
  return validateAllowlist(JSON.parse(fs.readFileSync(file, 'utf8')));
}

/** An entry is active until the end of its `expires` day (UTC). */
export function isExpired(entry, now = new Date()) {
  if (!entry.expires) return false;
  const endOfDay = Date.parse(`${entry.expires}T23:59:59.999Z`);
  return now.getTime() > endOfDay;
}

export function activeEntries(entries, now = new Date()) {
  return entries.filter(e => !isExpired(e, now));
}

/**
 * Finds the active entry (if any) suppressing a finding.
 * `finding.ids` holds every known identifier (GHSA, CVE, sonatype) for the advisory.
 */
export function findSuppression(finding, entries, now = new Date()) {
  const ids = new Set((finding.ids ?? []).map(i => i.toLowerCase()));
  return (
    activeEntries(entries, now).find(
      e => ids.has(e.id.toLowerCase()) || (e.ghsa !== undefined && ids.has(e.ghsa.toLowerCase()))
    ) ?? null
  );
}

/** AuditJS format: only `id` + `reason`, expired entries removed. */
export function toAuditJsFormat(entries, now = new Date()) {
  return { ignore: activeEntries(entries, now).map(({ id, reason }) => ({ id, reason })) };
}

/** GHSA IDs for dependency-review-action `allow-ghsas`. */
export function toGhsaList(entries, now = new Date()) {
  const out = new Set();
  for (const e of activeEntries(entries, now)) {
    if (/^GHSA/i.test(e.id)) out.add(e.id);
    if (e.ghsa) out.add(e.ghsa);
  }
  return [...out];
}

function main(argv) {
  const entries = loadAllowlist();
  const flag = argv[2];
  if (flag === '--check') {
    const expired = entries.filter(e => isExpired(e));
    for (const e of expired) console.warn(`::warning::Allowlist entry ${e.id} expired on ${e.expires}`);
    console.log(`allow-list.json OK: ${entries.length} entries, ${expired.length} expired`);
  } else if (flag === '--auditjs') {
    const out = argv[3];
    if (!out) throw new Error('usage: allowlist.mjs --auditjs <output-file>');
    fs.writeFileSync(out, JSON.stringify(toAuditJsFormat(entries), null, 2));
  } else if (flag === '--ghsas') {
    console.log(toGhsaList(entries).join(','));
  } else {
    throw new Error('usage: allowlist.mjs --check | --auditjs <file> | --ghsas');
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
