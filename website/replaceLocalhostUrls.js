const fs = require('fs');
const path = require('path');

/**
 * Refined script to replace localhost URLs in appd.v2.json files 
 * with production URLs based on their directory structure.
 */

const baseUrl = process.env.FDC3_BASE_URL || process.env.DEPLOY_PRIME_URL || 'https://fdc3.finos.org';
const staticDir = path.resolve(__dirname, 'static');

/**
 * Replace all localhost occurrences in a file
 * @param {string} filePath Absolute path to the file
 */
function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // Determine the logical app root relative to the 'static/' directory
    // Example path: toolbox/fdc3-example-apps/app1/static/appd.v2.json
    let relativeDir = path.relative(staticDir, path.dirname(filePath));
    
    // If the file is inside a 'static' folder (common pattern), the app root is one level up
    if (path.basename(relativeDir) === 'static') {
        relativeDir = path.dirname(relativeDir);
    }
    
    // Build the production base URL for this specific app
    const productionBase = `${baseUrl}/${relativeDir}/`.replace(/\/+$/, '/');

    console.log(`Processing ${path.basename(filePath)} in ${relativeDir}`);
    console.log(`Using production base: ${productionBase}`);

    // Pattern for http://localhost:PORT/ 
    // We also optionally match and strip 'static/' since the build is now flattened
    const localhostRegex = /http:\/\/localhost:\d+\/(static\/)?/g;

    content = content.replace(localhostRegex, () => {
        modified = true;
        return productionBase;
    });


    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated URLs in: ${filePath}`);
    }
}

/**
 * Recursively find and process appd.v2.json files
 */
function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file === 'appd.v2.json') {
            processFile(fullPath);
        }
    }
}

console.log(`Scanning for appd.v2.json files in ${staticDir}...`);
console.log(`Base URL: ${baseUrl}`);
walk(staticDir);
console.log('Replacement complete.');
