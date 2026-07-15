import { getSupabase } from '@/lib/supabase';

const MAX_CONTENT_CHARS = 600_000;
const MAX_LIST_BYTES = 1_500_000;
const MAX_TITLE_CHARS = 500;
const MAX_EXCERPT_CHARS = 600;

function stripDataUris(input: string): string {
  if (!input) return input;
  return input.replace(/data:[^\s"')<>]+/gi, '');
}

function stripBase64Images(markdown: string): string {
  if (!markdown) return markdown;
  let out = markdown;
  out = out.replace(
    /!\[([^\]]*)\]\(\s*data:[^)\s]+\s*(?:"[^"]*")?\s*\)/gi,
    (_match, alt: string) => (alt ? `*[image omitted: ${alt}]*` : ''),
  );
  out = out.replace(
    /<img\b[^>]*\bsrc\s*=\s*(?:"data:[^"]*"|'data:[^']*')[^>]*>/gi,
    '',
  );
  return stripDataUris(out);
}

function sanitizeArticleContent(content: string | null | undefined, slug: string): string | null {
  if (content == null) return null;
  let next = stripBase64Images(content);
  if (next.length > MAX_CONTENT_CHARS) {
    next = `${next.slice(0, MAX_CONTENT_CHARS)}\n\n*[content truncated]*`;
  }
  return next;
}

function sanitizeText(value: string | null | undefined, maxLen: number): string {
  if (value == null) return '';
  const cleaned = stripDataUris(value).trim();
  return cleaned.length > maxLen ? `${cleaned.slice(0, maxLen)}…` : cleaned;
}

function sanitizeImageUrl(url: string | null | undefined, slug: string): string | null {
  if (!url) return null;
  const t = url.trim();
  if (!t || /^data:/i.test(t) || t.length > 2048) return null;
  return t;
}

const ARTICLE_COLUMNS =
  'id, slug, title, excerpt, content, image_url, is_published, is_pinned, published_at, updated_at';

export type NewsArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  image_url: string | null;
  is_published: boolean;
  is_pinned: boolean;
  published_at: string | null;
  updated_at: string | null;
};

export type NewsListRow = {
  slug: string;
  title: string;
  excerpt: string;
  image_url: string | null;
  is_pinned: boolean;
  published_at: string | null;
};

type RawListRow = {
  slug: string;
  title: string | null;
  excerpt: string | null;
  image_url: string | null;
  is_pinned: boolean | null;
  published_at: string | null;
};

function sanitizeListRow(raw: RawListRow): NewsListRow {
  return {
    slug: raw.slug,
    title: sanitizeText(raw.title, MAX_TITLE_CHARS),
    excerpt: sanitizeText(raw.excerpt, MAX_EXCERPT_CHARS),
    image_url: sanitizeImageUrl(raw.image_url, raw.slug),
    is_pinned: Boolean(raw.is_pinned),
    published_at: raw.published_at,
  };
}

function capListByByteSize(rows: NewsListRow[]): NewsListRow[] {
  const capped: NewsListRow[] = [];
  let total = 0;
  for (const row of rows) {
    const size = JSON.stringify(row).length;
    if (total + size > MAX_LIST_BYTES) break;
    total += size;
    capped.push(row);
  }
  return capped;
}

export async function getPublishedArticlesList(): Promise<NewsListRow[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('news_articles')
    .select('slug, title, excerpt, image_url, is_pinned, published_at')
    .eq('is_published', true)
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(100);
  if (error) return [];
  return capListByByteSize(((data ?? []) as RawListRow[]).map(sanitizeListRow));
}

export async function getArticleBySlug(slug: string): Promise<NewsArticleRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('news_articles')
    .select(ARTICLE_COLUMNS)
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error || !data) return null;
  const row = data as NewsArticleRow;
  return {
    ...row,
    title: sanitizeText(row.title, MAX_TITLE_CHARS),
    excerpt: sanitizeText(row.excerpt, MAX_EXCERPT_CHARS),
    content: sanitizeArticleContent(row.content, slug),
    image_url: sanitizeImageUrl(row.image_url, slug),
  };
}

export async function getPublishedResources() {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('resources')
    .select('slug, title, excerpt, tags, image_url, content, file_url, published_at, updated_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getResourceBySlug(slug: string) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();
  if (error || !data) return null;
  return data;
}
