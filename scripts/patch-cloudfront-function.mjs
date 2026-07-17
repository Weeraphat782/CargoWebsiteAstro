#!/usr/bin/env node
/** One-off: attach CloudFront function to distribution config. */
import { readFileSync, writeFileSync } from 'node:fs';

const raw = JSON.parse(readFileSync('scripts/cf-dist-config-raw.json', 'utf8').replace(/^\uFEFF/, ''));
const config = raw.DistributionConfig;
config.DefaultCacheBehavior.FunctionAssociations = {
  Quantity: 1,
  Items: [
    {
      FunctionARN: 'arn:aws:cloudfront::992382688515:function/omgexp-marketing-url-rewrite',
      EventType: 'viewer-request',
    },
  ],
};
writeFileSync('scripts/cf-dist-config-updated.json', JSON.stringify(config, null, 2));
console.log('ETag:', raw.ETag);
