# AWS S3 + CloudFront deploy (marketing site)

Static Astro site → **S3** `omgexp-marketing-site` → **CloudFront** CDN.

| Resource | Value |
|----------|-------|
| Region | `ap-southeast-1` |
| S3 bucket | `omgexp-marketing-site` |
| CloudFront ID | `EG4RDROJ9ZNW1` |
| CloudFront URL | `https://d3c2ycuie46lns.cloudfront.net` |
| GitHub repo | `Weeraphat782/CargoWebsiteAstro` branch `master` |

## Push to deploy (GitHub Actions)

Workflow: [`.github/workflows/deploy-marketing.yml`](../.github/workflows/deploy-marketing.yml)

Triggers: push to `master`, or `workflow_dispatch` (CMS rebuild).

### GitHub Secrets (repo Settings → Secrets)

| Secret | Value |
|--------|-------|
| `AWS_ACCESS_KEY_ID` | IAM user key for CI deploy |
| `AWS_SECRET_ACCESS_KEY` | IAM secret |
| `CLOUDFRONT_DISTRIBUTION_ID` | `EG4RDROJ9ZNW1` |
| `PUBLIC_SITE_URL` | `https://d3c2ycuie46lns.cloudfront.net` |
| `PUBLIC_SUPABASE_URL` | `https://olcjmlvjtykcariimjbz.supabase.co` |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

Ask admin for IAM user with S3 bucket + CloudFront invalidation only — see [`AWS-IAM-GITHUB.md`](AWS-IAM-GITHUB.md).

## Deploy from your machine (SSO)

```powershell
cd web
$env:AWS_PROFILE = "omgexp"
$env:PUBLIC_SITE_URL = "https://d3c2ycuie46lns.cloudfront.net"
$env:PUBLIC_SUPABASE_URL = "https://olcjmlvjtykcariimjbz.supabase.co"
$env:PUBLIC_SUPABASE_ANON_KEY = "<from Tr .env.local>"
$env:PUBLIC_APP_URL = "https://cargo.omgexp.com"
$env:PUBLIC_CONTACT_API_URL = "https://cargo.omgexp.com/api/contact"
$env:PUBLIC_CANONICAL_BASE = "https://cargo.omgexp.com"
$env:PUBLIC_NOINDEX = "true"
node scripts/deploy-aws.mjs
```

## CMS rebuild from Tr (local)

Set in `Tr/.env.local`:

```
MARKETING_GITHUB_PAT=<fine-grained PAT with Actions:write on CargoWebsiteAstro>
MARKETING_GITHUB_REPO=Weeraphat782/CargoWebsiteAstro
MARKETING_GITHUB_WORKFLOW=deploy-marketing.yml
```

Saving news/resources in CMS triggers GitHub Actions rebuild.

## Not using Amplify

`amplify.yml` in repo is unused. Hosting is S3 + CloudFront only.
