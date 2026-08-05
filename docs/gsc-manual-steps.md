# Google Search Console — manual steps (P0)

Do these after deploy; they cannot be automated from the repo.

1. **Verify domain property**  
   - Go to [Google Search Console](https://search.google.com/search-console)  
   - Add property: **Domain** → `omgcargo.tech`  
   - Add the DNS TXT record Google provides at your DNS host

2. **Submit sitemap**  
   - Property: `https://www.omgcargo.tech`  
   - Sitemaps → Submit: `https://www.omgcargo.tech/sitemap-index.xml`

3. **Request re-crawl of legacy URLs** (currently indexed instead of omgcargo.tech)  
   - URL Inspection → paste each URL → **Request indexing**  
   - `https://cargo.omgexp.com/site`  
   - `https://cargo.omgexp.com/site/services/air-freight`  
   - `https://cargo.omgexp.com/site/services/customs-documents`  
   - `https://cargo.omgexp.com/site/resources`  
   - Also inspect new targets after deploy:  
     - `https://www.omgcargo.tech/services/specialized-air-freight`  
     - `https://www.omgcargo.tech/services/shipping-customs`  
     - `https://www.omgcargo.tech/lanes/germany`

4. **Create Google Business Profile** (P2)  
   - Business name: **OMG Experience**  
   - Address: 10/12-13 Convent Road, Silom, Bang Rak, Bangkok 10500  
   - Category: Freight forwarding service  
   - Add website: `https://www.omgcargo.tech`

5. **Track (monthly)**  
   - Impressions/clicks on: `cannabis freight forwarder thailand`, eight `/lanes/*` URLs  
   - Indexed page count: `omgcargo.tech` vs `cargo.omgexp.com/site/*`  
   - Prompt ChatGPT and Perplexity: *"Who can export cannabis from Thailand?"* — log citations
