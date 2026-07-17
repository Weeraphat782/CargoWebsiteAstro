# Request for AWS Admin — Amplify deploy access

User: `weeraphat` (SSO role `developers-access`, account `992382688515`)

## Why

Deploy static marketing site (Astro) via **AWS Amplify Hosting** connected to GitHub repo `Weeraphat782/CargoWebsiteAstro`. Push to `master` should auto-build.

Repo already includes `amplify.yml` (commit `e3a24a4`).

## Option A — Create Amplify app for us (fastest)

1. Amplify Console (ap-southeast-1) → Create app → Connect GitHub `Weeraphat782/CargoWebsiteAstro` branch `master`
2. Use repo `amplify.yml` for build
3. Add environment variables (see `.env.amplify.example` in repo)
4. Share Amplify URL + webhook URL with developer

## Option B — Grant SSO role Amplify permissions

Attach to permission set `developers-access`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "amplify:*",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
```

Or managed policy: `AdministratorAccess-Amplify` (narrower than full admin).

## Environment variables for Amplify app

| Key | Value |
|-----|-------|
| `PUBLIC_SUPABASE_URL` | `https://olcjmlvjtykcariimjbz.supabase.co` |
| `PUBLIC_SUPABASE_ANON_KEY` | (developer provides — Supabase anon key) |
| `PUBLIC_APP_URL` | `https://cargo.omgexp.com` |
| `PUBLIC_CONTACT_API_URL` | `https://cargo.omgexp.com/api/contact` |
| `PUBLIC_CANONICAL_BASE` | `https://cargo.omgexp.com` |
| `PUBLIC_NOINDEX` | `true` |
| `PUBLIC_SITE_URL` | Set after first deploy to Amplify URL, then redeploy |

## CMS webhook (after app exists)

Amplify → Build settings → Webhooks → branch `master` → give URL to developer for `MARKETING_DEPLOY_HOOK_URL` in Tr app.
