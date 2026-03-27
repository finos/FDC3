#!/usr/bin/env node
/**
 * Same behavior as FDC3-main-2.2.2-preview/scripts/rename-npm-scope.mjs with repo root = parent of scripts/.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git', '.nyc_output', '.husky']);
const EXT_OK = new Set(['.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.mts', '.cts']);

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  if (path.basename(filePath) === 'package-lock.json') return true;
  return EXT_OK.has(ext);
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

const from = '@robmoffat/';
const to = '@robmoffat/';
let n = 0;
for await (const file of walk(repoRoot)) {
  let text = await fs.promises.readFile(file, 'utf8');
  if (!text.includes(from)) continue;
  await fs.promises.writeFile(file, text.split(from).join(to), 'utf8');
  console.log('updated:', path.relative(repoRoot, file));
  n++;
}
console.log(`Done: ${n} file(s).`);
