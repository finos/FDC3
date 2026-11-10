// SPDX-License-Identifier: Apache-2.0
// Copyright FINOS FDC3 contributors - see NOTICE file

/**
 * Lockfile reachability.
 *
 * `npm audit --package-lock-only --workspace=x` does not scope its results to a workspace, so we
 * work out which lockfile entries each workspace pulls in ourselves, by walking package-lock.json
 * with npm's nearest-`node_modules` resolution rules.
 *
 * Returns, for a root (workspace or the project root), the set of lockfile paths
 * (e.g. "node_modules/a/node_modules/b") reachable through runtime dependencies only
 * (`runtime`) and through any dependency including devDependencies (`all`).
 */

const RUNTIME_KEYS = ['dependencies', 'optionalDependencies', 'peerDependencies'];
const DEV_KEYS = [...RUNTIME_KEYS, 'devDependencies'];

/** Finds the lock entry path a dependency name resolves to from `fromPath`, or null if not installed. */
export function resolveDependency(packages, fromPath, name) {
  let base = fromPath;
  for (;;) {
    const candidate = base ? `${base}/node_modules/${name}` : `node_modules/${name}`;
    if (packages[candidate]) return candidate;
    if (!base) return null;
    // Step up: strip a trailing "/node_modules/<name>" (or scoped) segment, otherwise go to the root.
    const idx = base.lastIndexOf('node_modules/');
    base = idx > 0 ? base.slice(0, idx - 1) : '';
  }
}

function walk(packages, startPath, keys, seen) {
  const stack = [startPath];
  while (stack.length) {
    const current = stack.pop();
    const entry = packages[current];
    if (!entry) continue;
    for (const key of keys) {
      // Only the starting package's devDependencies matter; installed packages never have theirs installed.
      const deps = current === startPath || key !== 'devDependencies' ? entry[key] : undefined;
      for (const name of Object.keys(deps ?? {})) {
        let target = resolveDependency(packages, current, name);
        if (!target) continue; // optional or uninstalled
        // Workspace symlinks: follow to the real package directory.
        const t = packages[target];
        if (t?.link && t.resolved) target = t.resolved;
        if (seen.has(target)) continue;
        seen.add(target);
        stack.push(target);
      }
    }
  }
}

/** @returns {{ runtime: Set<string>, all: Set<string> }} */
export function reachableFrom(lock, rootPath) {
  const packages = lock.packages ?? {};
  const runtime = new Set();
  const all = new Set();
  walk(packages, rootPath, RUNTIME_KEYS, runtime);
  walk(packages, rootPath, DEV_KEYS, all);
  return { runtime, all };
}
