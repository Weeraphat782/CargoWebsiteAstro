import type { APIRoute } from 'astro';
import { NOINDEX } from '@/lib/site';

export const GET: APIRoute = () => {
  const robots = NOINDEX
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\nSitemap: /sitemap-index.xml\n`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
