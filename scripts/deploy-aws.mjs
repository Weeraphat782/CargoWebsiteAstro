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

if (!skipBuild) {
  execSync('npm run build', { stdio: 'inherit' });
}
if (!existsSync('dist/index.html')) {
  console.error('dist/index.html missing — build failed?');
  process.exit(1);
}
execSync('npm run verify', { stdio: 'inherit' });
execSync(`aws s3 sync dist/ s3://${bucket}/ --delete ${profile}`, { stdio: 'inherit' });
execSync(
  `aws cloudfront create-invalidation --distribution-id ${distId} --paths "/*" ${profile}`,
  { stdio: 'inherit' },
);
console.log('Deploy complete.');
