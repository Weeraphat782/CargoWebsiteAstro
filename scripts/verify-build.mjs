#!/usr/bin/env node
/** ponytail: assert dist has login + contact wiring — fails if build output breaks */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const indexPath = join(root, 'dist', 'index.html');
if (!existsSync(indexPath)) {
  console.error('missing dist/index.html — run npm run build first');
  process.exit(1);
}
const indexHtml = readFileSync(indexPath, 'utf8');
const astroDir = join(root, 'dist', '_astro');
const contactChunk = readdirSync(astroDir).find((n) => n.startsWith('ContactForm.'));
const contactJs = contactChunk
  ? readFileSync(join(astroDir, contactChunk), 'utf8')
  : '';

const checks = [
  ['login link', indexHtml, 'cargo.omgexp.com/site/login'],
  ['noindex staging', indexHtml, 'noindex'],
  ['contact api', contactJs, 'cargo.omgexp.com/api/contact'],
];
for (const [label, haystack, needle] of checks) {
  if (!haystack.includes(needle)) {
    console.error(`FAIL: ${label} — expected "${needle}"`);
    process.exit(1);
  }
}
console.log('OK: login, contact API, and noindex verified in build output');
