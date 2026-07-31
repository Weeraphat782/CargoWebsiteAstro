#!/usr/bin/env node
/**
 * One-shot: resize/compress raster assets in public/ (in-place).
 * ponytail: run manually when images change — not wired into CI build.
 */
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import sharp from 'sharp';

const PUBLIC = join(process.cwd(), 'public');
const SKIP_DIRS = new Set(['manual']);
const SKIP_PREFIXES = ['favicon', 'web-app-manifest', 'apple-touch-icon'];
const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(PUBLIC, full).replace(/\\/g, '/');
    if (statSync(full).isDirectory()) {
      if (SKIP_DIRS.has(name)) continue;
      walk(full, out);
      continue;
    }
    const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
    if (!RASTER.has(ext)) continue;
    if (SKIP_PREFIXES.some((p) => name.startsWith(p))) continue;
    if (rel === 'og-default.png') continue;
    out.push(full);
  }
  return out;
}

function ruleFor(rel) {
  if (/^images\/carriers\//.test(rel)) return { maxWidth: 400, kind: 'logo' };
  if (/^images\/partners\//.test(rel)) return { maxWidth: 400, kind: 'logo' };
  if (/^logo\//.test(rel)) return { maxWidth: 400, kind: 'logo' };
  if (rel === 'logo.png' || rel === 'proforma-logo.png' || rel === 'images/Logo.png') {
    return { maxWidth: 1200, kind: 'logo' };
  }
  if (/\.jpe?g$/i.test(rel)) return { maxWidth: 1600, kind: 'photo' };
  return { maxWidth: 1600, kind: 'logo' };
}

async function optimizeFile(full) {
  const rel = relative(PUBLIC, full).replace(/\\/g, '/');
  const before = statSync(full).size;
  const { maxWidth, kind } = ruleFor(rel);
  const img = sharp(full);
  const meta = await img.metadata();
  const pipeline = img.resize({
    width: meta.width && meta.width > maxWidth ? maxWidth : undefined,
    withoutEnlargement: true,
  });

  const tmp = `${full}.opt`;
  if (kind === 'photo' || /\.jpe?g$/i.test(rel)) {
    await pipeline.jpeg({ quality: 80, mozjpeg: true }).toFile(tmp);
  } else {
    await pipeline.png({ compressionLevel: 9, palette: meta.width <= 512 }).toFile(tmp);
  }

  const { renameSync } = await import('node:fs');
  renameSync(tmp, full);
  const after = statSync(full).size;
  return { rel, before, after };
}

async function createOgDefault() {
  const out = join(PUBLIC, 'og-default.png');
  const logo = join(PUBLIC, 'logo.png');
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: { r: 13, g: 44, b: 77 },
    },
  })
    .composite([{ input: logo, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(out);
  const after = statSync(out).size;
  console.log(`og-default.png  ${(after / 1024).toFixed(1)} KB`);
}

const files = walk(PUBLIC);
let saved = 0;
for (const full of files) {
  const r = await optimizeFile(full);
  saved += r.before - r.after;
  console.log(
    `${r.rel.padEnd(44)} ${(r.before / 1024).toFixed(0).padStart(5)} KB -> ${(r.after / 1024).toFixed(0).padStart(5)} KB`,
  );
}
await createOgDefault();
console.log(`\nDone. Saved ${(saved / 1024 / 1024).toFixed(2)} MB across ${files.length} files.`);
