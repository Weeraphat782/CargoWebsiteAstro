#!/usr/bin/env node
/** Trigger GitHub Actions deploy-marketing workflow (CMS rebuild). */
const pat = process.env.MARKETING_GITHUB_PAT;
const repo = process.env.MARKETING_GITHUB_REPO ?? 'Weeraphat782/CargoWebsiteAstro';
const workflow = process.env.MARKETING_GITHUB_WORKFLOW ?? 'deploy-marketing.yml';
const ref = process.env.MARKETING_GITHUB_REF ?? 'master';

if (!pat) {
  console.error('Set MARKETING_GITHUB_PAT (fine-grained PAT with Actions: write on CargoWebsiteAstro)');
  process.exit(1);
}

const url = `https://api.github.com/repos/${repo}/actions/workflows/${workflow}/dispatches`;
const res = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${pat}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ ref }),
});

if (!res.ok) {
  const body = await res.text();
  console.error(`GitHub dispatch failed (${res.status}): ${body}`);
  process.exit(1);
}

console.log(`OK: triggered ${workflow} on ${repo}@${ref}`);
console.log('Watch: https://github.com/Weeraphat782/CargoWebsiteAstro/actions');
