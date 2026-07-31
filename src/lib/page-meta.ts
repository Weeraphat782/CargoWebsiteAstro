import {
  BRAND_NAME,
  absoluteUrl,
  getDefaultOgImageUrl,
  legacyCanonical,
  NOINDEX,
} from '@/lib/site';

/** Full `<title>` is `{title} | {BRAND_NAME}` — keep total ≤ 60 chars (WS2.1). */
const TITLE_SUFFIX_LEN = ` | ${BRAND_NAME}`.length;

function clampTitle(title: string): string {
  const max = 60 - TITLE_SUFFIX_LEN;
  // ponytail: reserve a few chars — Astro HTML-escapes & ' " in <title>
  const safeMax = max - 4;
  if (title.length <= safeMax) return title;
  return `${title.slice(0, safeMax - 1).replace(/\s+\S*$/, '')}…`;
}

/** SERP description budget 140–160; truncate long CMS excerpts at build time. */
function clampDescription(description: string): string {
  const t = description.trim().replace(/\s+/g, ' ');
  if (t.length <= 160) return t;
  return `${t.slice(0, 159).replace(/\s+\S*$/, '')}…`;
}

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  article?: { publishedTime?: string; modifiedTime?: string };
  /** Always noindex (404, thank-you pages). */
  forceNoindex?: boolean;
};

export function pageMeta(opts: PageMeta) {
  const title = clampTitle(opts.title);
  const description = clampDescription(opts.description);
  const url = absoluteUrl(opts.path);
  const canonical = NOINDEX ? legacyCanonical(opts.path) : url;
  const og = opts.ogImage || getDefaultOgImageUrl();
  const imgAlt = opts.ogImageAlt || opts.title;

  return {
    title,
    description,
    canonical,
    ogType: opts.article ? 'article' : 'website',
    ogTitle: `${title} | ${BRAND_NAME}`,
    ogDescription: description,
    ogUrl: url,
    ogImage: og,
    ogImageAlt: imgAlt,
    publishedTime: opts.article?.publishedTime,
    modifiedTime: opts.article?.modifiedTime,
    robots: opts.forceNoindex || NOINDEX ? 'noindex, follow' : 'index, follow',
  };
}
