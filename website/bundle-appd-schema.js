const SwaggerParser = require('@apidevtools/swagger-parser');
const fs = require('fs-extra');
const path = require('path');
const { pathToFileURL } = require('url');

async function main() {
  const sourcePath = path.join(
    __dirname,
    '../packages/fdc3-standard/src/app-directory/specification/appd.schema.json'
  );
  const destDir = path.join(__dirname, 'static/schemas/next');
  const destPath = path.join(destDir, 'appd.schema.json');

  const bundled = await SwaggerParser.bundle(pathToFileURL(sourcePath).href);
  await SwaggerParser.validate(bundled);

  await fs.ensureDir(destDir);
  await fs.writeJson(destPath, bundled, { spaces: 2 });
  console.log(`Bundled App Directory schema to ${destPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
