#!/usr/bin/env node
/**
 * One-shot CloudFront setup: apex→www 301, trailing-slash 301, 404 custom errors, security headers.
 * Updates the existing viewer-request function (only one allowed per behavior).
 * Local: AWS_PROFILE=omgexp node scripts/setup-cloudfront.mjs
 */
import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const distId = process.env.CLOUDFRONT_DISTRIBUTION_ID ?? 'EG4RDROJ9ZNW1';
const profileFlag = process.env.AWS_PROFILE ? `--profile ${process.env.AWS_PROFILE}` : '';
const CANONICAL_HOST = 'www.omgcargo.tech';
const SECURITY_HEADERS_POLICY_ID = '67f7725c-6f97-4210-82d7-5512b31e9d03';
/** Existing viewer-request fn — CloudFront allows only one per cache behavior. */
const FUNCTION_NAME = process.env.CF_VIEWER_FN ?? 'omgexp-marketing-url-rewrite';

const FUNCTION_CODE = `function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;
  var uri = request.uri;
  var target = uri.length > 1 && uri.endsWith('/') ? uri.slice(0, -1) : uri;
  if (host !== '${CANONICAL_HOST}' || target !== uri) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: 'https://${CANONICAL_HOST}' + target + qs(request) },
      },
    };
  }
  if (uri.endsWith('/')) {
    request.uri = uri + 'index.html';
  } else if (!uri.includes('.')) {
    request.uri = uri + '/index.html';
  }
  return request;
}

function qs(request) {
  var q = request.querystring;
  if (!q) return '';
  var parts = [];
  for (var key in q) {
    if (!Object.prototype.hasOwnProperty.call(q, key)) continue;
    var entry = q[key];
    if (entry.multiValue) {
      for (var i = 0; i < entry.multiValue.length; i++) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(entry.multiValue[i].value));
      }
    } else if (entry.value !== undefined && entry.value !== '') {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(entry.value));
    }
  }
  return parts.length ? '?' + parts.join('&') : '';
}`;

function aws(cmd) {
  return execSync(`aws ${cmd} ${profileFlag}`, { encoding: 'utf8' }).trim();
}

function awsJson(cmd) {
  return JSON.parse(aws(cmd));
}

console.log(`Distribution ${distId}`);
const cfg = awsJson(`cloudfront get-distribution-config --id ${distId} --output json`);
const etag = cfg.ETag;
const dist = cfg.DistributionConfig;

console.log('Aliases:', dist.Aliases?.Items?.join(', ') || '(none)');

const dir = mkdtempSync(join(tmpdir(), 'cf-fn-'));
const codePath = join(dir, 'index.js').replace(/\\/g, '/');
writeFileSync(join(dir, 'index.js'), FUNCTION_CODE);

const dev = awsJson(`cloudfront describe-function --name ${FUNCTION_NAME} --stage DEVELOPMENT --output json`);
awsJson(
  `cloudfront update-function --name ${FUNCTION_NAME} --if-match ${dev.ETag} --function-config Comment="apex redirect + trailing slash + S3 index rewrite",Runtime=cloudfront-js-2.0 --function-code fileb://${codePath} --output json`,
);
const devAfter = awsJson(`cloudfront describe-function --name ${FUNCTION_NAME} --stage DEVELOPMENT --output json`);
awsJson(`cloudfront publish-function --name ${FUNCTION_NAME} --if-match ${devAfter.ETag} --output json`);
rmSync(dir, { recursive: true, force: true });
console.log('Published function', FUNCTION_NAME);

dist.CustomErrorResponses = {
  Quantity: 2,
  Items: [
    { ErrorCode: 403, ResponsePagePath: '/404.html', ResponseCode: '404', ErrorCachingMinTTL: 60 },
    { ErrorCode: 404, ResponsePagePath: '/404.html', ResponseCode: '404', ErrorCachingMinTTL: 60 },
  ],
};
dist.DefaultCacheBehavior.ResponseHeadersPolicyId = SECURITY_HEADERS_POLICY_ID;

const distDir = mkdtempSync(join(tmpdir(), 'cf-dist-'));
const configPath = join(distDir, 'config.json').replace(/\\/g, '/');
writeFileSync(configPath, JSON.stringify(dist));
aws(`cloudfront update-distribution --id ${distId} --if-match ${etag} --distribution-config file://${configPath}`);
rmSync(distDir, { recursive: true, force: true });

console.log('CloudFront updated. Propagation may take a few minutes. Then: npm run smoke:live');
