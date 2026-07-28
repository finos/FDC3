const fs = require('fs');

const root = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const workspaces = root.workspaces || [];

const mismatched = workspaces
  .map(dir => ({
    dir,
    ...JSON.parse(fs.readFileSync(`${dir}/package.json`, 'utf8')),
  }))
  .filter(pkg => !pkg.private && pkg.version !== root.version);

if (mismatched.length) {
  console.error(
    `ERROR: Root version (${root.version}) does not match:\n` +
      mismatched.map(p => `  ${p.dir}: ${p.version}`).join('\n')
  );
  process.exit(1);
}

console.log(`All public workspace versions match root: ${root.version}`);
