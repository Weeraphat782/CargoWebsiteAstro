/**
 * Build-time CMS lastmod map for @astrojs/sitemap serialize().
 * ponytail: only CMS URLs with real dates — static pages omitted so Google trusts lastmod.
 */
import { createClient } from '@supabase/supabase-js';

function isTimestampSlug(slug) {
  return /-\d{13}$/.test(slug);
}

function toLastmod(iso) {
  if (!iso || typeof iso !== 'string') return null;
  const day = iso.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : null;
}

/** @param {{ supabaseUrl?: string; supabaseKey?: string }} [opts] */
export async function loadCmsLastmodMap(opts = {}) {
  const url = opts.supabaseUrl ?? process.env.PUBLIC_SUPABASE_URL;
  const key = opts.supabaseKey ?? process.env.PUBLIC_SUPABASE_ANON_KEY;
  const map = new Map();

  if (!url || !key) {
    console.warn('[sitemap] PUBLIC_SUPABASE_* missing — CMS lastmod skipped');
    return map;
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const [newsRes, resourcesRes] = await Promise.all([
      supabase
        .from('news_articles')
        .select('slug, published_at, updated_at')
        .eq('is_published', true),
      supabase
        .from('resources')
        .select('slug, published_at, updated_at')
        .eq('is_published', true),
    ]);

    for (const row of newsRes.data ?? []) {
      if (!row.slug || isTimestampSlug(row.slug)) continue;
      const lastmod = toLastmod(row.updated_at || row.published_at);
      if (lastmod) map.set(`/newsroom/${row.slug}`, lastmod);
    }

    for (const row of resourcesRes.data ?? []) {
      if (!row.slug || isTimestampSlug(row.slug)) continue;
      const lastmod = toLastmod(row.updated_at || row.published_at);
      if (lastmod) map.set(`/resources/${row.slug}`, lastmod);
    }
  } catch (err) {
    console.warn('[sitemap] CMS lastmod fetch failed:', err instanceof Error ? err.message : err);
  }

  return map;
}
