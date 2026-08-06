import { getImage } from 'astro:assets';

/** Card thumbnails (~150–170px tall). */
export const CMS_CARD_WIDTH = 400;
/** Featured news card (wider column). */
export const CMS_FEATURED_WIDTH = 800;
/** Article hero inside max-w-3xl (~768px). */
export const CMS_HERO_WIDTH = 800;

export type CmsImage = {
  src: string;
  srcSet?: string;
  width: number;
  height: number;
};

function normalizeRemoteUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  const t = url.trim();
  if (!t || /^data:/i.test(t) || t.length > 2048) return undefined;
  if (t.startsWith('//')) return `https:${t}`;
  if (/^https?:\/\//i.test(t)) return t;
  return undefined;
}

/** ponytail: one helper for Astro + React islands; fallback to raw URL if CMS image fails */
export async function optimizeCmsImage(
  url: string | null | undefined,
  width: number,
  height = width,
): Promise<CmsImage | undefined> {
  const src = normalizeRemoteUrl(url);
  if (!src) return undefined;

  try {
    const image = await getImage({ src, width, height, format: 'webp', quality: 78 });
    const w = Number(image.attributes.width) || width;
    const h = Number(image.attributes.height) || width;
    const srcSet = image.srcSet.values.length
      ? image.srcSet.values
          .map((v) => `${v.url} ${v.descriptor ?? `${v.transform.width}w`}`)
          .join(', ')
      : undefined;
    return {
      src: image.src,
      srcSet,
      width: w,
      height: h,
    };
  } catch (err) {
    console.warn(`[cms-image] optimize failed for ${src}:`, err);
    return { src, width, height };
  }
}

export async function mapWithCmsImages<T extends { imageUrl?: string }>(
  items: T[],
  width: number,
  height = width,
): Promise<(T & { cmsImage?: CmsImage })[]> {
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      cmsImage: await optimizeCmsImage(item.imageUrl, width, height),
    })),
  );
}
