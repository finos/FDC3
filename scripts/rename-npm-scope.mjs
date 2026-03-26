#!/usr/bin/env node
/**
 * One-shot rename of the npm scope in package names and import specifiers.
 * Only replaces "@oldScope/" -> "@newScope/" so URLs like https://github.com/finos/... are unchanged.
 *
 * Usage:
 *   node scripts/rename-npm-scope.mjs @finos @your-scope
 *   node scripts/rename-npm-scope.mjs @finos @your-scope --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git', '.nyc_output', '.husky']);

const EXT_OK = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.mts', '.cts']);

function parseArgs(argv) {
  const dryRun = argv.includes('--dry-run');
  const rest = argv.filter(a => a !== '--dry-run');
  const [oldScope, newScope] = rest;
  if (!oldScope?.startsWith('@') || !newScope?.startsWith('@')) {
    console.error('Usage: node scripts/rename-npm-scope.mjs @old-scope @new-scope [--dry-run]');
    process.exit(1);
  }
  return { oldScope, newScope, dryRun };
}

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  if (!EXT_OK.has(ext)) return false;
  const base = path.basename(filePath);
  if (base === 'package-lock.json') return true;
  return true;
}

async function* walk(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      yield* walk(full);
    } else if (ent.isFile() && shouldProcessFile(full)) {
      yield full;
    }
  }
}

function main() {
  const { oldScope, newScope, dryRun } = parseArgs(process.argv.slice(2));
  const from = `${oldScope}/`;
  const to = `${newScope}/`;

  if (from === to) {
    console.error('Old and new scope are the same.');
    process.exit(1);
  }

  (async () => {
    let changedFiles = 0;
    for await (const file of walk(repoRoot)) {
      let text = await fs.promises.readFile(file, 'utf8');
      if (!text.includes(from)) continue;
      const next = text.split(from).join(to);
      if (dryRun) {
        console.log(`would update: ${path.relative(repoRoot, file)}`);
        changedFiles++;
        continue;
      }
      await fs.promises.writeFile(file, next, 'utf8');
      console.log(`updated: ${path.relative(repoRoot, file)}`);
      changedFiles++;
    }
    if (changedFiles === 0) {
      console.log(`No files contained "${from}".`);
    } else {
      console.log(dryRun ? `Dry run: ${changedFiles} file(s) would change.` : `Done: ${changedFiles} file(s).`);
      if (!dryRun) {
        console.log('Next: rm -rf node_modules package-lock.json && npm install');
        console.log('Then: npm run syncpack && npm run build && npm test');
      }
    }
  })().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

main();
