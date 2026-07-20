# Cutover — omgcargo.tech + Google Search Console

Marketing site: **https://www.omgcargo.tech/**  
App (login, portal, API): **https://cargo.omgexp.com**

## Before deploy (manual)

### GitHub Secret (`CargoWebsiteAstro`)

Build uses workflow env `PUBLIC_SITE_URL=https://www.omgcargo.tech` (no secret change required). Optional: update secret `PUBLIC_SITE_URL` to match for local docs consistency.

### Vercel env (Tr / Exportation-Tracker)

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_MARKETING_URL` | `https://www.omgcargo.tech` |
| `MARKETING_SITE_ORIGIN` | `https://www.omgcargo.tech` |
| `MARKETING_GITHUB_PAT` | fine-grained PAT (Actions:write on CargoWebsiteAstro) |

Redeploy Tr after env change. Push Tr code with 301 middleware.

## Verify after deploy

```text
https://www.omgcargo.tech/robots.txt     → Allow + Sitemap
https://www.omgcargo.tech/sitemap-index.xml
View source homepage                     → index, follow + canonical www.omgcargo.tech
https://cargo.omgexp.com/site            → 301 → www.omgcargo.tech
https://cargo.omgexp.com/site/login      → stays on cargo (no redirect)
```

## GSC (do after live index)

1. [Google Search Console](https://search.google.com/search-console) → **Add property**
2. **Domain** property: `omgcargo.tech` → verify with **DNS TXT** (same DNS as AWS)
3. **Sitemaps** → submit: `https://www.omgcargo.tech/sitemap-index.xml`
4. Keep old property `cargo.omgexp.com` — monitor 301 coverage; do not delete yet
5. Optional: old property → **Settings** → **Change of address** → `omgcargo.tech`

Sitemap is generated at build by `@astrojs/sitemap` using `PUBLIC_SITE_URL`.
