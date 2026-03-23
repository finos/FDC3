import { build } from 'vite';
import path from 'path';
import fs from 'fs';

/**
 * ONLY builds apps in 'front-end-apps/' directory.
 * Server apps are intended to be run live or are not built into static bundles.
 */
async function runBuilds() {
  const rootDir = process.cwd();
  const frontEndAppsDir = path.resolve(rootDir, 'front-end-apps');
  const distDir = path.resolve(rootDir, 'dist');

  // Clear dist directory before build
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }

  if (!fs.existsSync(frontEndAppsDir)) {
    console.error('front-end-apps directory not found.');
    return;
  }

  const apps = fs
    .readdirSync(frontEndAppsDir, { withFileTypes: true })
    .filter(dirent => {
      const appPath = path.join(frontEndAppsDir, dirent.name);
      return dirent.isDirectory() && fs.existsSync(path.join(appPath, 'index.html'));
    })
    .map(dirent => ({
      name: dirent.name,
      root: path.join(frontEndAppsDir, dirent.name),
    }));

  console.log(`Found ${apps.length} front-end apps to build: ${apps.map(a => a.name).join(', ')}`);

  for (const app of apps) {
    console.log(`\n--- Building Front-End App: ${app.name} ---`);
    await build({
      root: app.root,
      base: './',
      build: {
        outDir: path.resolve(distDir, app.name),
        emptyOutDir: false,
      },
    });
  }

  console.log('\nFront-end build complete.');
}

runBuilds().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
