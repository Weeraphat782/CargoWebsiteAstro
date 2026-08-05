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
const siteBase = (process.env.PUBLIC_SITE_URL || 'https://www.omgcargo.tech').replace(/\/$/, '');

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

function decodeHtmlEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/** Expected canonical URL for a dist HTML file (non-trailing-slash). */
function distPathToUrl(htmlPath) {
  let rel = htmlPath.replace(dist, '').replace(/\\/g, '/');
  if (rel.endsWith('/index.html')) rel = rel.slice(0, -'/index.html'.length) || '/';
  else if (rel.endsWith('.html')) rel = rel.slice(0, -5);
  if (!rel.startsWith('/')) rel = `/${rel}`;
  if (rel === '/') return siteBase;
  return `${siteBase}${rel}`;
}

function parseSitemapLocs() {
  const indexFile = join(dist, 'sitemap-index.xml');
  const single = join(dist, 'sitemap-0.xml');
  let xml = '';
  if (existsSync(single)) xml = readFileSync(single, 'utf8');
  else if (existsSync(indexFile)) {
    const idx = readFileSync(indexFile, 'utf8');
    const m = idx.match(/<loc>([^<]+sitemap-\d+\.xml)<\/loc>/);
    if (m) {
      const chunkName = m[1].split('/').pop();
      if (existsSync(join(dist, chunkName))) xml = readFileSync(join(dist, chunkName), 'utf8');
    }
  }
  const locs = new Set();
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) locs.add(m[1]);
  return locs;
}

const BAD_PLACEHOLDER = /\bundefined\b|\bNaN\b|\{\{[^}]+\}\}|Lorem ipsum|\bTODO\b/i;
const IMG_TAG_RE = /<img\b[^>]*>/gi;
const ALT_RE = /\balt\s*=/i;
const JSONLD_RE = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;

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
if (!contactJs.includes('attribution')) {
  fail('contact form missing attribution payload');
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

const htmlFiles = walkHtml(dist);
const indexableCanonicals = new Set();
const descriptions = new Map();

// Partner-certification claims must not imply OMG holds GDP/ISO certs
const FORBIDDEN_CLAIMS = [
  /GDP Certified/i,
  /GDP-certified handling/i,
  /\bour GDP warehousing\b/i,
  /\bour ISO-certified lab\b/i,
  /pharmaceutical-grade logistics/i,
];
for (const htmlPath of htmlFiles) {
  const html = readFileSync(htmlPath, 'utf8');
  const rel = htmlPath.replace(dist, '').replace(/\\/g, '/');
  if (rel.startsWith('/manual/')) continue;
  for (const re of FORBIDDEN_CLAIMS) {
    if (re.test(html)) fail(`${rel}: forbidden partner-certification claim matched ${re}`);
  }
}

function isRedirectStub(html) {
  return html.includes('http-equiv="refresh"') && html.includes('Redirecting to:');
}

for (const htmlPath of htmlFiles) {
  const html = readFileSync(htmlPath, 'utf8');
  const rel = htmlPath.replace(dist, '').replace(/\\/g, '/');
  if (rel.startsWith('/manual/')) continue;
  if (isRedirectStub(html)) {
    if (!html.includes('noindex')) fail(`${rel}: redirect stub must be noindex`);
    continue;
  }

  for (const tag of html.match(IMG_TAG_RE) ?? []) {
    if (!ALT_RE.test(tag)) {
      fail(`<img> missing alt in ${rel}: ${tag.slice(0, 80)}`);
    }
  }

  if (BAD_PLACEHOLDER.test(html)) {
    fail(`placeholder token in ${rel}`);
  }

  if (html.includes('href="#"')) {
    fail(`${rel}: placeholder href="#" in production HTML`);
  }

  const gtmCount = (html.match(/googletagmanager\.com\/gtm\.js/g) ?? []).length;
  if (gtmCount > 1) {
    fail(`${rel}: GTM container loaded ${gtmCount} times (expected ≤1)`);
  }

  const robotsMatch = html.match(/<meta name="robots" content="([^"]+)"/i);
  const isIndexable = !robotsMatch?.[1]?.includes('noindex');

  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/gi)];
  if (canonicals.length !== 1) {
    fail(`${rel}: expected 1 canonical, got ${canonicals.length}`);
  } else {
    const canon = canonicals[0][1];
    if (isIndexable) indexableCanonicals.add(canon);
    if (!noindex && isIndexable) {
      const expected = distPathToUrl(htmlPath);
      if (canon !== expected) {
        fail(`${rel}: canonical mismatch ${canon} vs ${expected}`);
      }
    }
  }

  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  if (h1Count !== 1) fail(`${rel}: expected 1 h1, got ${h1Count}`);

  for (const m of html.matchAll(JSONLD_RE)) {
    try {
      JSON.parse(m[1]);
    } catch {
      fail(`${rel}: invalid JSON-LD`);
    }
  }

  for (const prop of ['og:title', 'og:description', 'og:url', 'og:image']) {
    const re = new RegExp(`<meta property="${prop.replace(':', '\\:')}" content="([^"]+)"`, 'i');
    const om = html.match(re);
    if (!om?.[1]?.trim()) fail(`${rel}: missing or empty ${prop}`);
  }
  const tw = html.match(/<meta name="twitter:card" content="([^"]+)"/i);
  if (!tw?.[1]?.trim()) fail(`${rel}: missing twitter:card`);

  const titleM = html.match(/<title>([^<]*)<\/title>/i);
  if (titleM) {
    const len = decodeHtmlEntities(titleM[1]).length;
    if (len > 60) fail(`${rel}: title length ${len} > 60 (${decodeHtmlEntities(titleM[1])})`);
  }

  const descM = html.match(/<meta name="description" content="([^"]*)"/i);
  if (descM) {
    const d = descM[1];
    const len = d.length;
    if (len < 140 || len > 160) {
      fail(`${rel}: description length ${len} outside 140-160`);
    }
    if (descriptions.has(d)) {
      fail(`${rel}: duplicate description (also on ${descriptions.get(d)})`);
    }
    descriptions.set(d, rel);
  }
}

const notFoundPath = join(dist, '404.html');
if (!existsSync(notFoundPath)) {
  fail('dist/404.html missing');
} else {
  const nf = readFileSync(notFoundPath, 'utf8');
  if (!nf.includes('noindex')) fail('404.html must be noindex');
}

if (!noindex) {
  const sitemapLocs = parseSitemapLocs();
  for (const loc of sitemapLocs) {
    if (/-\d{13}/.test(loc)) fail(`sitemap slug with timestamp: ${loc}`);
  }
  const missing = [...indexableCanonicals].filter((u) => !sitemapLocs.has(u));
  const extra = [...sitemapLocs].filter((u) => !indexableCanonicals.has(u));
  if (missing.length) {
    fail(`sitemap missing indexable URLs: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '…' : ''}`);
  }
  if (extra.length) {
    fail(`sitemap extra URLs: ${extra.slice(0, 3).join(', ')}${extra.length > 3 ? '…' : ''}`);
  }
}

for (const legal of ['privacy-policy', 'terms-of-service', 'cookie-policy']) {
  const p = join(dist, legal, 'index.html');
  if (!existsSync(p)) fail(`missing legal page dist/${legal}/index.html`);
}

const cannabisPath = join(dist, 'services', 'cannabis-export-logistics', 'index.html');
if (!existsSync(cannabisPath)) {
  fail('missing dist/services/cannabis-export-logistics/index.html');
} else {
  const cannabisHtml = readFileSync(cannabisPath, 'utf8');
  if (!cannabisHtml.includes('FAQPage')) fail('cannabis page missing FAQPage JSON-LD');
  if (!/<table\b/i.test(cannabisHtml)) fail('cannabis page missing route <table>');
}

const checkCount = htmlFiles.length + 12;
if (failures.length) {
  console.error(`FAILED (${failures.length}) of ~${checkCount} checks:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log(
  `OK: ${htmlFiles.length} pages — login, contact+attribution, robots, RSS, AI robots, og-default, images, canonical, h1, JSON-LD, og, 404, sitemap, legal, cannabis FAQ+table`,
);
