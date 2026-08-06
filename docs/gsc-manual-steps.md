# Google Search Console — manual steps (post–Change of Address)

Do these after deploy; they cannot be automated from the repo.

**Change of Address status:** `cargo.omgexp.com` → `omgcargo.tech` started **31 Jul 2026**. Do **not** cancel the move. COA expires ~**Jan 2027** (180 days). Keep Tr’s 301 redirects live until then (`NEXT_PUBLIC_MARKETING_URL` must stay set on Vercel).

---

## You do in GSC (~10 min)

### 1. Verify domain property (if not done)

- [Google Search Console](https://search.google.com/search-console)
- Add property: **Domain** → `omgcargo.tech`
- Add the DNS TXT record Google provides

### 2. Remove old sitemap (cargo property)

- Property: `cargo.omgexp.com`
- **Sitemaps** → remove `https://cargo.omgexp.com/sitemap.xml`
- This sitemap conflicted with Change of Address (listed `/site/*` as priority 1). Tr no longer serves it after deploy.

### 3. Submit new sitemap (omgcargo.tech property)

- Property: `https://www.omgcargo.tech`
- **Sitemaps** → submit: `https://www.omgcargo.tech/sitemap-index.xml`

### 4. Request indexing — `.tech` URLs only (~10/day quota)

**Do not** re-crawl `cargo.omgexp.com/site/*` manually. Change of Address handles legacy URL consolidation.

**Day 1 (priority):**

- `https://www.omgcargo.tech/`
- `https://www.omgcargo.tech/services/cannabis-export-logistics`
- `https://www.omgcargo.tech/services/shipping-customs`
- `https://www.omgcargo.tech/services/specialized-air-freight`
- `https://www.omgcargo.tech/services`
- `https://www.omgcargo.tech/lanes/germany`
- `https://www.omgcargo.tech/lanes/switzerland`
- `https://www.omgcargo.tech/lanes/australia`

**Day 2 (remaining new pages):**

- `https://www.omgcargo.tech/lanes/south-africa`
- `https://www.omgcargo.tech/lanes/new-zealand`
- `https://www.omgcargo.tech/lanes/portugal`
- `https://www.omgcargo.tech/lanes/czech-republic`
- `https://www.omgcargo.tech/lanes/north-macedonia`
- `https://www.omgcargo.tech/services/gdp-warehousing`
- `https://www.omgcargo.tech/services/controlled-temperature-transport`
- `https://www.omgcargo.tech/services/qc-lab-testing`

**Do not submit** (redirect stubs, noindex): `/services/air-freight`, `/services/customs-documents`, `/sitemap.xml`.

---

## Optional (P2)

### Google Business Profile

- Business name: **OMG Experience**
- Address: 10/12-13 Convent Road, Silom, Bang Rak, Bangkok 10500
- Category: Freight forwarding service
- Website: `https://www.omgcargo.tech`

---

## Track (monthly)

- Impressions/clicks on: `cannabis freight forwarder thailand`, eight `/lanes/*` URLs
- Indexed page count: `omgcargo.tech` vs `cargo.omgexp.com/site/*` (should shift toward `.tech`)
- Prompt ChatGPT and Perplexity: *"Who can export cannabis from Thailand?"* — log citations
