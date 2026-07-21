import type { APIRoute } from 'astro';
import { getPublishedArticlesList, getPublishedResources } from '@/lib/newsroom-data';
import { absoluteUrl, BRAND_NAME, BRAND_LEGAL_NAME } from '@/lib/site';

export const GET: APIRoute = async () => {
  const base = absoluteUrl('');
  const reviewed = new Date().toISOString().slice(0, 10);
  const lines: string[] = [];

  try {
    const news = (await getPublishedArticlesList()).slice(0, 5);
    const res = (await getPublishedResources()).slice(0, 5);
    news.forEach((n) =>
      lines.push(`- [${n.title}](${base}/newsroom/${n.slug})`),
    );
    res.forEach((r) =>
      lines.push(`- [${r.title}](${base}/resources/${r.slug})`),
    );
  } catch {
    // skip pillar lines
  }

  const pillarLines = lines.length ? `## Pillar content\n${lines.join('\n')}\n` : '';

  const body = `# ${BRAND_NAME}

> Specialized air freight, GDP warehousing, customs, and AI-assisted document intelligence for pharmaceutical and time-sensitive cargo.

## Entity
- Type: Organization (logistics / air freight)
- Website: [${BRAND_NAME}](${base}/)
- Legal name: ${BRAND_LEGAL_NAME}

## Key pages
- [Homepage](${base}/)
- [Services](${base}/services)
- [Newsroom](${base}/newsroom)
- [Resources](${base}/resources)
- [About](${base}/about)
- [Contact](${base}/contact)

${pillarLines}## Machine-readable endpoints
- [RSS feed](${base}/feed.xml)
- [Sitemap index](${base}/sitemap-index.xml)

Last reviewed: ${reviewed}
`.trim();

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
