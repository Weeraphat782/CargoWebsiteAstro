import type { APIRoute } from 'astro';
import { getPublishedArticlesList } from '@/lib/newsroom-data';
import { absoluteUrl, BRAND_NAME } from '@/lib/site';

function escapeCdata(s: string): string {
  return s.replace(/]]>/g, ']]]]><![CDATA[>');
}

export const GET: APIRoute = async () => {
  const base = absoluteUrl('');
  const now = new Date().toUTCString();
  let itemsXml = '';

  try {
    const posts = await getPublishedArticlesList();
    if (posts.length) {
      itemsXml = posts.slice(0, 20).map((p) => {
        const link = `${base}/newsroom/${p.slug}`;
        const pub = p.published_at ? new Date(p.published_at).toUTCString() : now;
        return `
<item>
  <title><![CDATA[${escapeCdata(p.title)}]]></title>
  <description><![CDATA[${escapeCdata(p.excerpt || '')}]]></description>
  <link>${link}</link>
  <guid isPermaLink="true">${link}</guid>
  <pubDate>${pub}</pubDate>
  <author>${BRAND_NAME} Editorial</author>
</item>`;
      }).join('');
    }
  } catch {
    // empty feed
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${BRAND_NAME} Newsroom</title>
  <link>${base}/newsroom</link>
  <description>Company announcements and logistics industry news from ${BRAND_NAME}.</description>
  <language>en-us</language>
  <lastBuildDate>${now}</lastBuildDate>
  ${itemsXml}
</channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
