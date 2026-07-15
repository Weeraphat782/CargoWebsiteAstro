import {
  BRAND_NAME,
  absoluteUrl,
  getDefaultOgImageUrl,
  legacyCanonical,
  NOINDEX,
} from '@/lib/site';

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogImageAlt?: string;
  article?: { publishedTime?: string; modifiedTime?: string };
};

export function pageMeta(opts: PageMeta) {
  const title = opts.title;
  const description = opts.description;
  const url = absoluteUrl(opts.path);
  const canonical = legacyCanonical(opts.path);
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
    robots: NOINDEX ? 'noindex, follow' : 'index, follow',
  };
}
