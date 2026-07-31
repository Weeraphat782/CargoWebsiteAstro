#!/usr/bin/env node
/** ponytail: assert dist SEO + image budget — fails if build output regresses */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const indexPath = join(dist, 'index.html');
if (!existsSync(indexPath)) {
  console.error('missing dist/index.html — run npm run build first');
  process.exit(1);
}

const failures = [];
const noindex = process.env.PUBLIC_NOINDEX !== 'false';

function fail(msg) {
  failures.push(msg);
}

function walkHtml(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkHtml(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

function walkImages(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkImages(full, out);
    else if (/\.(jpe?g|png|webp|avif)$/i.test(name)) out.push(full);
  }
  return out;
}

const indexHtml = readFileSync(indexPath, 'utf8');
const astroDir = join(dist, '_astro');
const contactChunk = existsSync(astroDir)
  ? readdirSync(astroDir).find((n) => n.startsWith('ContactForm.'))
  : undefined;
const contactJs = contactChunk
  ? readFileSync(join(astroDir, contactChunk), 'utf8')
  : '';

if (!indexHtml.includes('cargo.omgexp.com/site/login')) {
  fail('login link missing cargo.omgexp.com/site/login');
}
if (!contactJs.includes('cargo.omgexp.com/api/contact')) {
  fail('contact api missing cargo.omgexp.com/api/contact');
}

const robotsNeedle = noindex ? 'noindex' : 'index, follow';
if (!indexHtml.includes(robotsNeedle)) {
  fail(`robots meta expected "${robotsNeedle}"`);
}

if (!indexHtml.includes('application/rss+xml')) {
  fail('RSS alternate link missing from HTML head');
}

const robotsPath = join(dist, 'robots.txt');
if (existsSync(robotsPath)) {
  const robotsTxt = readFileSync(robotsPath, 'utf8');
  if (!noindex) {
    for (const bot of [
      'GPTBot',
      'OAI-SearchBot',
      'ChatGPT-User',
      'ClaudeBot',
      'Claude-SearchBot',
      'Claude-User',
      'PerplexityBot',
      'Google-Extended',
      'Applebot-Extended',
      'CCBot',
      'Bytespider',
    ]) {
      if (!robotsTxt.includes(`User-agent: ${bot}`)) {
        fail(`robots.txt missing User-agent: ${bot}`);
      }
    }
    if (!/User-agent: Bytespider[\s\S]*?Disallow: \//.test(robotsTxt)) {
      fail('robots.txt should disallow Bytespider');
    }
  }
} else {
  fail('dist/robots.txt missing');
}

const ogPath = join(dist, 'og-default.png');
if (!existsSync(ogPath)) {
  fail('dist/og-default.png missing');
}

const maxImageBytes = 400 * 1024;
for (const img of walkImages(join(dist, 'images'))) {
  const size = statSync(img).size;
  if (size > maxImageBytes) {
    fail(`image too large (${Math.round(size / 1024)} KB): ${img.replace(dist, '')}`);
  }
}

const imgTagRe = /<img\b[^>]*>/gi;
const altRe = /\balt\s*=/i;
for (const htmlPath of walkHtml(dist)) {
  const html = readFileSync(htmlPath, 'utf8');
  for (const tag of html.match(imgTagRe) ?? []) {
    if (!altRe.test(tag)) {
      fail(`<img> missing alt in ${htmlPath.replace(dist, '')}: ${tag.slice(0, 80)}`);
    }
  }
}

if (failures.length) {
  console.error(`FAILED (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `OK: login, contact API, robots (${noindex ? 'noindex' : 'index'}), RSS, AI robots, og-default, image budget, img alt`,
);
