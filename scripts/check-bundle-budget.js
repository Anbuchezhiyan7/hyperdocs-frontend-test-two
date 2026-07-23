#!/usr/bin/env node
/**
 * Bundle Budget Check — run after `npm run build`
 *
 * Usage:
 *   node scripts/check-bundle-budget.js
 *
 * Add to CI:
 *   - run: npm run build && node scripts/check-bundle-budget.js
 *
 * Budgets (adjust as needed):
 *   MAIN_CHUNK_BUDGET_KB   — sum of all JS chunks loaded on first paint
 *   SINGLE_CHUNK_BUDGET_KB — no single async chunk should exceed this
 */

const fs = require('fs');
const path = require('path');

const MAIN_CHUNK_BUDGET_KB = 500;    // total first-load JS budget (gzipped estimate ÷ ~3)
const SINGLE_CHUNK_BUDGET_KB = 300;  // max size of any single async chunk

const buildDir = path.resolve(__dirname, '../.next');
const manifestPath = path.join(buildDir, 'build-manifest.json');

if (!fs.existsSync(manifestPath)) {
    console.error('❌  .next/build-manifest.json not found. Run `npm run build` first.');
    process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Collect all unique JS files referenced in the manifest
const allChunks = new Set();

// Main entry chunks (app router: _app → layout → page)
const appPages = manifest.pages || {};
Object.values(appPages).forEach(chunks => {
    if (Array.isArray(chunks)) {
        chunks.filter(c => c.endsWith('.js')).forEach(c => allChunks.add(c));
    }
});

// App Router async chunks
const appDir = path.join(buildDir, 'static', 'chunks', 'app');
if (fs.existsSync(appDir)) {
    fs.readdirSync(appDir, { recursive: true })
        .filter(f => f.endsWith('.js'))
        .forEach(f => allChunks.add(path.join('static', 'chunks', 'app', f)));
}

let errors = [];
let totalMainKB = 0;
let largestChunk = { name: '', sizeKB: 0 };

allChunks.forEach(chunk => {
    const filePath = path.join(buildDir, chunk);
    if (!fs.existsSync(filePath)) return;

    const sizeKB = fs.statSync(filePath).size / 1024;
    totalMainKB += sizeKB;

    if (sizeKB > largestChunk.sizeKB) {
        largestChunk = { name: chunk, sizeKB };
    }

    if (sizeKB > SINGLE_CHUNK_BUDGET_KB) {
        errors.push(`  ⚠️  ${chunk}: ${sizeKB.toFixed(1)} KB > ${SINGLE_CHUNK_BUDGET_KB} KB limit`);
    }
});

console.log('\n📦  Bundle Budget Report');
console.log('─'.repeat(50));
console.log(`  Total JS (approx uncompressed): ${totalMainKB.toFixed(1)} KB`);
console.log(`  Budget:                         ${MAIN_CHUNK_BUDGET_KB} KB`);
console.log(`  Largest chunk:                  ${largestChunk.name} (${largestChunk.sizeKB.toFixed(1)} KB)`);

let exitCode = 0;

if (errors.length > 0) {
    console.log('\n⚠️  Oversized individual chunks:');
    errors.forEach(e => console.log(e));
    exitCode = 1;
}

if (totalMainKB > MAIN_CHUNK_BUDGET_KB) {
    console.log(`\n❌  Total bundle exceeds budget: ${totalMainKB.toFixed(1)} KB > ${MAIN_CHUNK_BUDGET_KB} KB`);
    exitCode = 1;
} else {
    console.log(`\n✅  Total bundle within budget: ${totalMainKB.toFixed(1)} KB / ${MAIN_CHUNK_BUDGET_KB} KB`);
}

console.log('─'.repeat(50));
process.exit(exitCode);
