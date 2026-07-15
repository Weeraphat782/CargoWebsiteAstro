/** Canonical site URL and brand constants for SEO / GEO. */
export const BRAND_NAME = 'OMG Experience';
export const BRAND_SHORT = 'OMG Experience';
export const BRAND_LEGAL_NAME = 'OMG Experience';
export const DEFAULT_AUTHOR_NAME = 'Editorial Team, OMG Experience';

/** Next.js app (auth, portal, contact API). */
export const APP_URL = (
  import.meta.env.PUBLIC_APP_URL || 'https://cargo.omgexp.com'
).replace(/\/$/, '');

/** Legacy marketing URLs on cargo — canonical target during noindex staging. */
export const CANONICAL_BASE = (
  import.meta.env.PUBLIC_CANONICAL_BASE || 'https://cargo.omgexp.com'
).replace(/\/$/, '');

export const NOINDEX = import.meta.env.PUBLIC_NOINDEX !== 'false';

export function getSiteUrl(): string {
  if (import.meta.env.PUBLIC_SITE_URL) {
    return import.meta.env.PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  return 'http://localhost:4321';
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path || path === '/') return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Canonical on legacy /site/* paths until root domain cutover. */
export function legacyCanonical(path: string): string {
  const legacyPath = path === '/' ? '/site' : `/site${path}`;
  return `${CANONICAL_BASE}${legacyPath}`;
}

export const DEFAULT_OG_IMAGE_PATH = '/logo.png';

export function getDefaultOgImageUrl(): string {
  return absoluteUrl(DEFAULT_OG_IMAGE_PATH);
}

export function appUrl(path: string): string {
  if (!path || path === '/') return APP_URL;
  return `${APP_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
