import {
  BRAND_NAME,
  absoluteUrl,
  getDefaultOgImageUrl,
  legacyCanonical,
  NOINDEX,
} from '@/lib/site';

/** `<title>` budget — total must stay ≤ 60 chars (WS2.1, asserted in verify-build). */
const TITLE_MAX = 60;
const TITLE_SUFFIX = ` | ${BRAND_NAME}`;

/**
 * Cut on a word boundary without appending an ellipsis — a self-added "…" reads as a
 * broken page in the SERP, and Google adds its own marker when it truncates.
 */
function clampTitle(title: string, budget: number): string {
  if (title.length <= budget) return title;
  return title.slice(0, budget).replace(/\s+\S*$/, '');
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
  // ponytail: CMS article titles skip the brand suffix — those 17 chars buy a whole
  // title instead of a truncated one, and og:site_name already carries the brand.
  const withBrand = !opts.article;
  const clamped = clampTitle(
    opts.title,
    withBrand ? TITLE_MAX - TITLE_SUFFIX.length : TITLE_MAX
  );
  const title = withBrand ? `${clamped}${TITLE_SUFFIX}` : clamped;
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
    ogTitle: title,
    ogDescription: description,
    ogUrl: url,
    ogImage: og,
    ogImageAlt: imgAlt,
    publishedTime: opts.article?.publishedTime,
    modifiedTime: opts.article?.modifiedTime,
    robots: opts.forceNoindex || NOINDEX ? 'noindex, follow' : 'index, follow',
  };
}
