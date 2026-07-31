#!/usr/bin/env node
/** Post-deploy smoke — asserts live origin headers and redirects (WS9). */
import { execSync } from 'node:child_process';

const ORIGIN = (process.env.SMOKE_ORIGIN || 'https://www.omgcargo.tech').replace(/\/$/, '');
const APEX = process.env.SMOKE_APEX || 'https://omgcargo.tech';
const failures = [];

function fail(msg) {
  failures.push(msg);
}

function curl(args) {
  return execSync(`curl.exe -sI ${args}`, { encoding: 'utf8' });
}

function header(headers, name) {
  const re = new RegExp(`^${name}:\\s*(.+)$`, 'im');
  const m = headers.match(re);
  return m ? m[1].trim() : '';
}

// apex → www in one hop (query string preserved)
try {
  const h = curl(`-o NUL -w "" -D - --max-redirs 0 "${APEX}/?fbclid=smoke-test"`);
  const code = h.match(/^HTTP\/[\d.]+ (\d+)/m)?.[1];
  const loc = header(h, 'location');
  if (code !== '301' || !loc.includes('www.omgcargo.tech') || !loc.includes('fbclid=smoke-test')) {
    fail(`apex redirect: expected 301→www with fbclid, got ${code} loc=${loc || '(none)'}`);
  }
} catch (e) {
  fail(`apex redirect check failed: ${e.message}`);
}

// trailing slash → non-trailing in one hop
try {
  const h = curl(`-o NUL -w "" -D - --max-redirs 0 "${ORIGIN}/services/"`);
  const code = h.match(/^HTTP\/[\d.]+ (\d+)/m)?.[1];
  const loc = header(h, 'location');
  if (code !== '301' || loc !== `${ORIGIN}/services`) {
    fail(`trailing slash redirect: expected 301→/services, got ${code} loc=${loc || '(none)'}`);
  }
} catch (e) {
  fail(`trailing slash check failed: ${e.message}`);
}

// timestamp slug → clean slug (OC-28)
try {
  const oldSlug = '/newsroom/gacp-good-agricultural-collection-practices-1782094522286';
  const h = curl(`-o NUL -w "" -D - --max-redirs 0 "${ORIGIN}${oldSlug}"`);
  const code = h.match(/^HTTP\/[\d.]+ (\d+)/m)?.[1];
  const loc = header(h, 'location');
  const expected = `${ORIGIN}/newsroom/gacp-good-agricultural-collection-practices`;
  if (code !== '301' || loc !== expected) {
    fail(`timestamp slug redirect: expected 301→${expected}, got ${code} loc=${loc || '(none)'}`);
  }
} catch (e) {
  fail(`timestamp slug check failed: ${e.message}`);
}

// missing page → 404 (after CloudFront custom error + 404.html deploy)
try {
  const h = curl(`"${ORIGIN}/smoke-missing-page"`);
  const code = h.match(/^HTTP\/[\d.]+ (\d+)/m)?.[1];
  if (code !== '404') fail(`missing page: expected 404, got ${code}`);
} catch (e) {
  fail(`404 check failed: ${e.message}`);
}

// security headers on HTML
try {
  const h = curl(`"${ORIGIN}/"`);
  if (!header(h, 'strict-transport-security')) fail('missing Strict-Transport-Security');
  const hsts = header(h, 'strict-transport-security');
  if (!/includeSubDomains/i.test(hsts)) fail(`HSTS missing includeSubDomains: ${hsts || '(none)'}`);
} catch (e) {
  fail(`HSTS check failed: ${e.message}`);
}

// cache-control classes
try {
  const html = curl(`"${ORIGIN}/"`);
  const ccHtml = header(html, 'cache-control');
  if (!/must-revalidate|max-age=0/i.test(ccHtml)) {
    fail(`HTML cache-control unexpected: ${ccHtml || '(none)'}`);
  }

  const page = execSync(`curl.exe -s "${ORIGIN}/"`, { encoding: 'utf8' });
  const asset = page.match(/\/_astro\/[^"']+\.(css|js)/)?.[0];
  if (asset) {
    const ah = curl(`"${ORIGIN}${asset}"`);
    const ccAsset = header(ah, 'cache-control');
    if (!/immutable|max-age=31536000/i.test(ccAsset)) {
      fail(`hashed asset cache-control unexpected: ${ccAsset || '(none)'}`);
    }
  }

  const ih = curl(`"${ORIGIN}/images/air-freight.jpg"`);
  const ccImg = header(ih, 'cache-control');
  if (!/max-age=2592000/i.test(ccImg)) {
    fail(`image cache-control unexpected: ${ccImg || '(none)'}`);
  }
} catch (e) {
  fail(`cache-control check failed: ${e.message}`);
}

if (failures.length) {
  console.error(`SMOKE FAILED (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('SMOKE OK: apex 301+query, trailing slash 301, timestamp slug 301, 404, HSTS+subdomains, cache-control');
