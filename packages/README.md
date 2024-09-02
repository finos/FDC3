Updating Module Versions
========================
// first, update version number in package.json
npm login
npm version <version from package.json> --workspaces
npm run syncpack
npm up
npm run build
npm publish --access=public --workspaces