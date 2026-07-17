# CMS → auto rebuild marketing site (static / แนว A)

Published news/resources live in Supabase. The Astro site is **static** — content is baked at build time. After CMS save, trigger a GitHub Actions rebuild (~1–2 min) to refresh CloudFront.

## Flow

```text
CMS Save (published) → Tr POST /api/marketing/rebuild → GitHub workflow_dispatch
→ build Astro → S3 sync → CloudFront invalidate
```

Staging URL: https://d3c2ycuie46lns.cloudfront.net/

---

## 1. GitHub fine-grained PAT (one-time)

1. GitHub → **Settings** → **Developer settings** → **Fine-grained personal access tokens** → **Generate new token**
2. **Repository access:** Only select `Weeraphat782/CargoWebsiteAstro`
3. **Permissions:** **Actions** → **Read and write**
4. Generate and copy the token (shown once)

---

## 2. Tr app env

In [`Tr/.env.local`](../../Tr/.env.local) (never commit):

```env
MARKETING_GITHUB_PAT=github_pat_xxxx
MARKETING_GITHUB_REPO=Weeraphat782/CargoWebsiteAstro
MARKETING_GITHUB_WORKFLOW=deploy-marketing.yml
MARKETING_SITE_ORIGIN=https://d3c2ycuie46lns.cloudfront.net
```

Restart `npm run dev` in `Tr/` after adding the PAT.

**Production (after Tr push):** same vars in Vercel project env for `Tr`.

---

## 3. Test from CMS (local Tr)

```powershell
cd Tr
npm run dev
```

1. Staff login → `/cms/news` or `/cms/resources`
2. Edit a **published** item → **Save**
3. Toast: "Marketing site rebuild started"
4. GitHub → **Actions** → new **Deploy marketing site** run (~1 min)
5. Open CloudFront URL → check newsroom/resources

---

## 4. Test without CMS

```powershell
cd web
$env:MARKETING_GITHUB_PAT = "github_pat_xxxx"
npm run rebuild:cms
```

Or load PAT from `Tr/.env.local` manually — do not commit tokens.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Save works, no Actions run | `MARKETING_GITHUB_PAT` missing or wrong; restart Tr dev server |
| Actions 403 | PAT needs **Actions: Read and write** on `CargoWebsiteAstro` |
| Article not on site after green run | Wait 1–2 min; hard refresh CloudFront URL |
| Draft save | Rebuild only runs when **Published** is on |

---

## After domain cutover

- Set `PUBLIC_SITE_URL` in GitHub Secrets to production marketing URL
- Keep `MARKETING_GITHUB_PAT` on Vercel for prod CMS
- No change to Save → rebuild flow
