# OMG Experience — Marketing Site (Astro)

SEO-focused static marketing site. Reads Newsroom/Resources from Supabase at build time.

## Setup

```bash
cd web
cp .env.example .env
# Fill PUBLIC_SUPABASE_URL + PUBLIC_SUPABASE_ANON_KEY (same project as Tr/)
npm install --legacy-peer-deps
npm run dev   # http://localhost:4321
```

Copy `logo.png` and `/public/images/*` from `Tr/public/` if missing.

## Env vars (Vercel)

| Variable | Purpose |
|---|---|
| `PUBLIC_SUPABASE_URL` | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Anon key (published rows only) |
| `PUBLIC_APP_URL` | `https://cargo.omgexp.com` — Login/Register links |
| `PUBLIC_CONTACT_API_URL` | `https://cargo.omgexp.com/api/contact` |
| `PUBLIC_CANONICAL_BASE` | Legacy canonical during staging (`https://cargo.omgexp.com`) |
| `PUBLIC_NOINDEX` | `true` until root domain cutover |
| `PUBLIC_SITE_URL` | This site's URL after deploy |
| `PUBLIC_HERO_BG` | `video` for looping hero mp4, else static image |
| `PUBLIC_DOCUMENT_DEMO_API_URL` | Tr public document-demo API (home demo) |

### Hero background video (optional)

Place `public/video/hero-bg.mp4` and set `PUBLIC_HERO_BG=video`. Poster frame lives at `public/images/hero-poster.jpg` (used for LCP preload). To regenerate the poster from the mp4:

```bash
ffmpeg -ss 00:00:01 -i public/video/hero-bg.mp4 -vframes 1 -q:v 2 public/images/hero-poster.jpg
```

Smaller mp4 (~1–2MB, 720p H.264) loads faster in production:

```bash
ffmpeg -i public/video/hero-bg.mp4 -vf scale=-2:720 -c:v libx264 -crf 28 -an public/video/hero-bg-sm.mp4
```

(then swap the file or update `HERO_VIDEO_SRC` in `src/lib/hero.ts`.)

## Tr app integration

In **Tr** env (local `.env.local` or Vercel), set:

- `MARKETING_GITHUB_PAT` — fine-grained PAT with Actions:write on `CargoWebsiteAstro` (see [`docs/CMS-REBUILD.md`](docs/CMS-REBUILD.md))
- `MARKETING_SITE_ORIGIN` — e.g. `https://d3c2ycuie46lns.cloudfront.net` (CORS for contact form)

CMS publish calls `/api/marketing/rebuild` → GitHub Actions deploy.

## Deploy (AWS)

See [`docs/AWS-DEPLOY.md`](docs/AWS-DEPLOY.md) and [`docs/GITHUB-SECRETS.md`](docs/GITHUB-SECRETS.md).

## Routes

| Astro | Legacy (cargo) |
|---|---|
| `/` | `/site` |
| `/about` | `/site/about` |
| `/contact` | `/site/contact` |
| `/services/*` | `/site/services/*` |
| `/newsroom/*` | `/site/newsroom/*` |
| `/resources/*` | `/site/resources/*` |

Login → `PUBLIC_APP_URL/site/login`
