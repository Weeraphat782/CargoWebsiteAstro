#!/usr/bin/env node
/**
 * One-shot CloudFront setup: apex→www 301, trailing-slash 301, timestamp-slug 301,
 * 404 custom errors, custom security headers (HSTS includeSubDomains).
 * Local: AWS_PROFILE=omgexp node scripts/setup-cloudfront.mjs
 */
import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const distId = process.env.CLOUDFRONT_DISTRIBUTION_ID ?? 'EG4RDROJ9ZNW1';
const profileFlag = process.env.AWS_PROFILE ? `--profile ${process.env.AWS_PROFILE}` : '';
const CANONICAL_HOST = 'www.omgcargo.tech';
const SECURITY_POLICY_NAME = 'omgexp-marketing-security';
/** Existing viewer-request fn — CloudFront allows only one per cache behavior. */
const FUNCTION_NAME = process.env.CF_VIEWER_FN ?? 'omgexp-marketing-url-rewrite';

const FUNCTION_CODE = `function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;
  var uri = request.uri;
  var normalized = uri.length > 1 && uri.endsWith('/') ? uri.slice(0, -1) : uri;
  var target = normalized.replace(/-\\d{13}$/, '');
  if (host !== '${CANONICAL_HOST}' || uri !== normalized || target !== normalized) {
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

function ensureSecurityHeadersPolicyId() {
  const list = awsJson('cloudfront list-response-headers-policies --type custom --output json');
  const items = list.ResponseHeadersPolicyList?.Items ?? [];
  for (const item of items) {
    const cfg = item.ResponseHeadersPolicy?.ResponseHeadersPolicyConfig;
    if (cfg?.Name === SECURITY_POLICY_NAME) {
      return item.ResponseHeadersPolicy.Id;
    }
  }

  const policyDir = mkdtempSync(join(tmpdir(), 'cf-rhp-'));
  const policyPath = join(policyDir, 'policy.json').replace(/\\/g, '/');
  writeFileSync(
    policyPath,
    JSON.stringify({
      Name: SECURITY_POLICY_NAME,
      Comment: 'OMG marketing — HSTS includeSubDomains + nosniff + referrer + frame',
      SecurityHeadersConfig: {
        StrictTransportSecurity: {
          Override: true,
          IncludeSubdomains: true,
          Preload: false,
          AccessControlMaxAgeSec: 31536000,
        },
        ContentTypeOptions: { Override: true },
        FrameOptions: { Override: true, FrameOption: 'SAMEORIGIN' },
        ReferrerPolicy: { Override: true, ReferrerPolicy: 'strict-origin-when-cross-origin' },
      },
    }),
  );
  const created = awsJson(
    `cloudfront create-response-headers-policy --response-headers-policy-config file://${policyPath} --output json`,
  );
  rmSync(policyDir, { recursive: true, force: true });
  const id = created.ResponseHeadersPolicy?.Id;
  if (!id) throw new Error('create-response-headers-policy returned no Id');
  console.log('Created response headers policy', SECURITY_POLICY_NAME, id);
  return id;
}

console.log(`Distribution ${distId}`);

const dir = mkdtempSync(join(tmpdir(), 'cf-fn-'));
const codePath = join(dir, 'index.js').replace(/\\/g, '/');
writeFileSync(join(dir, 'index.js'), FUNCTION_CODE);

const dev = awsJson(`cloudfront describe-function --name ${FUNCTION_NAME} --stage DEVELOPMENT --output json`);
awsJson(
  `cloudfront update-function --name ${FUNCTION_NAME} --if-match ${dev.ETag} --function-config Comment="apex+slash+timestamp redirect + S3 index rewrite",Runtime=cloudfront-js-2.0 --function-code fileb://${codePath} --output json`,
);
const devAfter = awsJson(`cloudfront describe-function --name ${FUNCTION_NAME} --stage DEVELOPMENT --output json`);
awsJson(`cloudfront publish-function --name ${FUNCTION_NAME} --if-match ${devAfter.ETag} --output json`);
rmSync(dir, { recursive: true, force: true });
console.log('Published function', FUNCTION_NAME);

const securityPolicyId = ensureSecurityHeadersPolicyId();

// Fresh ETag — function publish may have changed distribution metadata elsewhere
const cfg = awsJson(`cloudfront get-distribution-config --id ${distId} --output json`);
const etag = cfg.ETag;
const dist = cfg.DistributionConfig;

console.log('Aliases:', dist.Aliases?.Items?.join(', ') || '(none)');

dist.CustomErrorResponses = {
  Quantity: 2,
  Items: [
    { ErrorCode: 403, ResponsePagePath: '/404.html', ResponseCode: '404', ErrorCachingMinTTL: 60 },
    { ErrorCode: 404, ResponsePagePath: '/404.html', ResponseCode: '404', ErrorCachingMinTTL: 60 },
  ],
};
dist.DefaultCacheBehavior.ResponseHeadersPolicyId = securityPolicyId;

const distDir = mkdtempSync(join(tmpdir(), 'cf-dist-'));
const configPath = join(distDir, 'config.json').replace(/\\/g, '/');
writeFileSync(configPath, JSON.stringify(dist));
aws(`cloudfront update-distribution --id ${distId} --if-match ${etag} --distribution-config file://${configPath}`);
rmSync(distDir, { recursive: true, force: true });

console.log('CloudFront updated. Propagation may take a few minutes. Then: npm run smoke:live');
