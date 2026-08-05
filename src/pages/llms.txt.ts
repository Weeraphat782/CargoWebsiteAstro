import type { APIRoute } from 'astro';
import { getPublishedArticlesList, getPublishedResources } from '@/lib/newsroom-data';
import { exportLanes } from '@/data/marketing-lanes';
import {
  absoluteUrl,
  APP_URL,
  BRAND_NAME,
  BRAND_LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from '@/lib/site';

export const GET: APIRoute = async () => {
  const base = absoluteUrl('');
  const reviewed = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];

  try {
    const news = (await getPublishedArticlesList()).slice(0, 5);
    const res = (await getPublishedResources()).slice(0, 5);
    news.forEach((n) => lines.push(`- [${n.title}](${base}/newsroom/${n.slug})`));
    res.forEach((r) => lines.push(`- [${r.title}](${base}/resources/${r.slug})`));
  } catch {
    // skip pillar lines
  }

  const laneLines = exportLanes
    .map((l) => `- [${l.country} export lane](${base}/lanes/${l.slug}) — ${l.gateway}`)
    .join('\n');

  const pillarLines = lines.length ? `## Pillar content\n${lines.join('\n')}\n` : '';

  const body = `# ${BRAND_NAME}

> Bangkok air freight forwarder for licensed cannabis, hemp, and kratom exports. OMG Experience coordinates air freight, Thai customs (ภ.ท.32), and partner GDP warehousing and ISO-certified lab COA — we hold neither GDP nor ISO certification ourselves. ~20+ shipments/month; NIA-backed.

## Entity
- Type: Organization (air freight forwarder / export logistics)
- Website: [${BRAND_NAME}](${base}/)
- Legal name: ${BRAND_LEGAL_NAME}
- Email: ${CONTACT_EMAIL}
- Phone: ${CONTACT_PHONE_DISPLAY} (${CONTACT_PHONE_E164})
- Office: 10/12-13 Convent Road, Silom, Bang Rak, Bangkok 10500, Thailand
- Origin airport: Bangkok Suvarnabhumi (BKK)

## Verified facts (last reviewed ${reviewed})
- DTAM issued 100–200 ภ.ท.32 export certificates/month nationwide, as stated by the Deputy Government Spokesperson on 2026-06-27 (government statement via press; not a standing rate).
- 266 GACP-certified farms as at 2026-06-10 per DTAM Division of Medical Cannabis (pull live count before citing).
- Germany imported 50,539 kg medical cannabis in Q1 2026 (+34% YoY, −15% QoQ) per BfArM data reported in trade press May–June 2026.
- 31 Dec 2026 expiry applies to Category 5 **extract** licences (Thai FDA), not DTAM controlled-herb flower export licences.

## Key pages
- [Homepage](${base}/)
- [Cannabis export logistics](${base}/services/cannabis-export-logistics)
- [Services](${base}/services)
- [Export lanes](${base}/services/cannabis-export-logistics#routes)
- [Resources](${base}/resources)
- [Newsroom](${base}/newsroom)
- [About](${base}/about)
- [Contact](${base}/contact)
- [Export Portal login](${APP_URL}/site/login)

## Destination lanes (BKK)
${laneLines}

${pillarLines}## Machine-readable endpoints
- [RSS feed](${base}/feed.xml)
- [Sitemap index](${base}/sitemap-index.xml)

Last reviewed: ${reviewed}
`.trim();

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
