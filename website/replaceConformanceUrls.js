#!/usr/bin/env node

/**
 * Script to replace hard-coded fdc3.finos.org URLs in the conformance JSON file
 * with the appropriate base URL based on the environment.
 * 
 * Priority:
 * 1. FDC3_BASE_URL environment variable (if set)
 * 2. Netlify DEPLOY_PRIME_URL (for preview/branch deploys)
 * 3. Default: https://fdc3.finos.org (for production)
 */

const fs = require('fs');
const path = require('path');

// Determine the base URL to use
function getBaseUrl() {
    // Check for explicit FDC3_BASE_URL first
    if (process.env.FDC3_BASE_URL) {
        return process.env.FDC3_BASE_URL;
    }

    // Check for local development (docusaurus start)
    if (process.env.NODE_ENV === 'development') {
        console.log('Running in development mode');
        return 'http://localhost:3000';
    }

    // For Netlify preview/branch deploys, use DEPLOY_PRIME_URL
    if (process.env.DEPLOY_PRIME_URL && process.env.CONTEXT !== 'production') {
        return process.env.DEPLOY_PRIME_URL;
    }

    // Default to production URL
    return 'https://fdc3.finos.org';
}

const baseUrl = getBaseUrl();
const filePath = path.join(__dirname, 'static/toolbox/fdc3-conformance/directories/website-conformance.v2.json');

// Check if file exists
if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Conformance file not found at ${filePath}. Skipping URL replacement.`);
    console.warn(`  This is normal if conformance files haven't been built yet.`);
    process.exit(0);
}

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Replace all instances of https://fdc3.finos.org with the base URL
const oldUrl = 'https://fdc3.finos.org';
const newContent = content.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), baseUrl);

// Only write if content changed
if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✓ Replaced ${oldUrl} with ${baseUrl} in conformance file`);
    console.log(`  File: ${filePath}`);
} else {
    console.log(`✓ No URL replacements needed in conformance file`);
}

