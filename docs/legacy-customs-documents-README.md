# Legacy customs-documents page — archive note

**Archived:** 2026-08-05  
**Requested URL:** `https://cargo.omgexp.com/site/services/customs-documents`  
**Result:** HTTP 404 (branded error page saved as `legacy-customs-documents.html`)

The legacy page was no longer live at fetch time. Substantive copy (TK-10/11/31/32, GACP certs, Certificate of Origin, phytosanitary, NSW filing) was recovered into:

- [`src/data/marketing-services.ts`](../src/data/marketing-services.ts) — `shipping-customs` service `extraBody` and FAQ on [`src/pages/services/[slug].astro`](../src/pages/services/[slug].astro)

Redirect: `/services/customs-documents` → `/services/shipping-customs` (see `astro.config.mjs`).
