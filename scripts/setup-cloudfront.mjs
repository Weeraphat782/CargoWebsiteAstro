#!/usr/bin/env node
/**
 * One-shot CloudFront setup: apex→www 301, 404 custom errors, security headers.
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
const FUNCTION_NAME = 'omgexp-marketing-apex-www';

const FUNCTION_CODE = `function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;
  if (host !== '${CANONICAL_HOST}') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: { value: 'https://${CANONICAL_HOST}' + request.uri }
      }
    };
  }
  return request;
}`;

function aws(cmd) {
  return execSync(`aws ${cmd} ${profileFlag}`, { encoding: 'utf8' }).trim();
}

function awsJson(cmd) {
  return JSON.parse(aws(cmd));
}

function writeFnCode(dir) {
  const p = join(dir, 'index.js');
  writeFileSync(p, FUNCTION_CODE);
  return p.replace(/\\/g, '/');
}

console.log(`Distribution ${distId}`);
const cfg = awsJson(`cloudfront get-distribution-config --id ${distId} --output json`);
const etag = cfg.ETag;
const dist = cfg.DistributionConfig;

console.log('Aliases:', dist.Aliases?.Items?.join(', ') || '(none)');
if (!dist.Aliases?.Items?.includes('omgcargo.tech')) {
  console.warn('WARN: omgcargo.tech not in CloudFront aliases — check DNS / second distribution.');
}

let publishedArn;
try {
  awsJson(`cloudfront describe-function --name ${FUNCTION_NAME} --stage LIVE --output json`);
  const dev = awsJson(`cloudfront describe-function --name ${FUNCTION_NAME} --stage DEVELOPMENT --output json`);
  const dir = mkdtempSync(join(tmpdir(), 'cf-fn-'));
  const codePath = writeFnCode(dir);
  awsJson(
    `cloudfront update-function --name ${FUNCTION_NAME} --if-match ${dev.ETag} --function-config Comment="apex to www",Runtime=cloudfront-js-2.0 --function-code fileb://${codePath} --output json`,
  );
  rmSync(dir, { recursive: true, force: true });
  console.log('Updated function', FUNCTION_NAME);
} catch {
  const dir = mkdtempSync(join(tmpdir(), 'cf-fn-'));
  const codePath = writeFnCode(dir);
  awsJson(
    `cloudfront create-function --name ${FUNCTION_NAME} --function-config Comment="apex to www",Runtime=cloudfront-js-2.0 --function-code fileb://${codePath} --output json`,
  );
  rmSync(dir, { recursive: true, force: true });
  console.log('Created function', FUNCTION_NAME);
}

const devAfter = awsJson(`cloudfront describe-function --name ${FUNCTION_NAME} --stage DEVELOPMENT --output json`);
const pub = awsJson(
  `cloudfront publish-function --name ${FUNCTION_NAME} --if-match ${devAfter.ETag} --output json`,
);
publishedArn = pub.FunctionSummary.FunctionMetadata.FunctionARN;
console.log('Published function', publishedArn);

dist.CustomErrorResponses = {
  Quantity: 2,
  Items: [
    { ErrorCode: 403, ResponsePagePath: '/404.html', ResponseCode: '404', ErrorCachingMinTTL: 60 },
    { ErrorCode: 404, ResponsePagePath: '/404.html', ResponseCode: '404', ErrorCachingMinTTL: 60 },
  ],
};

dist.DefaultCacheBehavior.ResponseHeadersPolicyId = SECURITY_HEADERS_POLICY_ID;

const fnAssoc = dist.DefaultCacheBehavior.FunctionAssociations?.Items ?? [];
const kept = fnAssoc.filter((a) => !a.FunctionARN?.includes(FUNCTION_NAME));
kept.push({ EventType: 'viewer-request', FunctionARN: publishedArn });
dist.DefaultCacheBehavior.FunctionAssociations = { Quantity: kept.length, Items: kept };

const dir = mkdtempSync(join(tmpdir(), 'cf-dist-'));
const configPath = join(dir, 'config.json').replace(/\\/g, '/');
writeFileSync(configPath, JSON.stringify(dist));
aws(`cloudfront update-distribution --id ${distId} --if-match ${etag} --distribution-config file://${configPath}`);
rmSync(dir, { recursive: true, force: true });

console.log('CloudFront updated. Propagation may take a few minutes. Then: npm run smoke:live');
