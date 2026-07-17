# GitHub Secrets checklist

Set these in https://github.com/Weeraphat782/CargoWebsiteAstro/settings/secrets/actions

| Secret | Value |
|--------|-------|
| `AWS_ACCESS_KEY_ID` | From IAM user `omgexp-marketing-github` (see AWS-IAM-GITHUB.md) |
| `AWS_SECRET_ACCESS_KEY` | Same IAM user |
| `CLOUDFRONT_DISTRIBUTION_ID` | `EG4RDROJ9ZNW1` |
| `PUBLIC_SITE_URL` | `https://d3c2ycuie46lns.cloudfront.net` |
| `PUBLIC_SUPABASE_URL` | `https://olcjmlvjtykcariimjbz.supabase.co` |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (from Tr `.env.local`) |

Until secrets are set, deploy locally:

```powershell
$env:AWS_PROFILE = "omgexp"
# ... env vars ...
npm run deploy:aws
```

First manual deploy completed 2026-07-17 via SSO profile `omgexp`.
