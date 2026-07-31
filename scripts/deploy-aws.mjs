#!/usr/bin/env node
/**
 * Build (optional) + sync dist/ to S3 + CloudFront invalidation.
 * Local: AWS_PROFILE=omgexp node scripts/deploy-aws.mjs
 * ponytail: no retry — re-run on failure.
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const bucket = process.env.S3_BUCKET ?? 'omgexp-marketing-site';
const distId = process.env.CLOUDFRONT_DISTRIBUTION_ID ?? 'EG4RDROJ9ZNW1';
const profile = process.env.AWS_PROFILE ? `--profile ${process.env.AWS_PROFILE}` : '';
const skipBuild = process.argv.includes('--skip-build');

function aws(cmd) {
  execSync(`aws ${cmd} ${profile}`, { stdio: 'inherit' });
}

function syncDist(args) {
  aws(`s3 sync dist/ s3://${bucket}/ ${args}`);
}

if (!skipBuild) {
  execSync('npm run build', { stdio: 'inherit' });
}
if (!existsSync('dist/index.html')) {
  console.error('dist/index.html missing — build failed?');
  process.exit(1);
}
execSync('npm run verify', { stdio: 'inherit' });

// Hashed bundles — immutable
syncDist(
  '--delete --exclude "*" --include "_astro/*" --cache-control "public, max-age=31536000, immutable"',
);
// Static media — long cache (filenames are stable; optimize-images.mjs when assets change)
syncDist(
  '--exclude "*" --include "images/*" --include "video/*" --include "logo/*" --include "og-default.png" --include "logo.png" --cache-control "public, max-age=2592000"',
);
// HTML, sitemap, robots, feed — revalidate every visit
syncDist(
  '--delete --exclude "_astro/*" --exclude "images/*" --exclude "video/*" --exclude "logo/*" --exclude "og-default.png" --exclude "logo.png" --cache-control "public, max-age=0, must-revalidate"',
);

aws(
  `cloudfront create-invalidation --distribution-id ${distId} --paths "/*"`,
);
console.log('Deploy complete.');
