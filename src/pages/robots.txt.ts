import type { APIRoute } from 'astro';
import { NOINDEX, absoluteUrl } from '@/lib/site';

const ALLOWED_AI_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
] as const;

const BLOCKED_AI_BOTS = ['Bytespider'] as const;

function aiBotLines(allow: boolean) {
  return [...ALLOWED_AI_BOTS, ...BLOCKED_AI_BOTS]
    .map((bot) => {
      const rule = ALLOWED_AI_BOTS.includes(bot as (typeof ALLOWED_AI_BOTS)[number])
        ? allow
          ? 'Allow: /'
          : 'Disallow: /'
        : 'Disallow: /';
      return `User-agent: ${bot}\n${rule}\n`;
    })
    .join('\n');
}

export const GET: APIRoute = () => {
  const robots = NOINDEX
    ? `User-agent: *\nDisallow: /\n`
    : `# AI crawler policy — search/citation bots allowed; Bytespider blocked (WS7.5)
${aiBotLines(true)}
User-agent: *
Allow: /
Sitemap: ${absoluteUrl('/sitemap-index.xml')}
`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
