#!/usr/bin/env node
/**
 * SPDX-License-Identifier: Apache-2.0
 * CLI entry for @finos/fdc3-example-apps (npm bin / npx).
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const tsxCli = require.resolve('tsx/cli');

const child = spawn(process.execPath, [tsxCli, path.join(packageRoot, 'main.ts'), ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: packageRoot,
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
