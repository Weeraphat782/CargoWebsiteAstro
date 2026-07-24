
interface ResourceCardProps {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  imageUrl?: string;
}

export default function ResourceCard({ slug, title, excerpt, tags, imageUrl }: ResourceCardProps) {
  const primaryTag = tags[0] ?? 'Guide';
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-white transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-2)]">
      {imageUrl && (
        <div className="relative h-[150px]">
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,44,77,0.05)] to-[rgba(13,44,77,0.35)]" />
          <span
            className="absolute left-3 top-3 rounded-[var(--radius-sm)] bg-white px-2 py-1 text-[10.5px] font-bold uppercase tracking-wide"
            style={{ color: 'var(--navy-700)' }}
          >
            {primaryTag}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-[18px]">
        <h2 className="font-display text-[16.5px] font-bold leading-snug" style={{ color: 'var(--navy-950)' }}>
          <a href={`/resources/${slug}`} className="hover:underline">
            {title}
          </a>
        </h2>
        <p className="mt-2.5 flex-1 text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
          {excerpt}
        </p>
        <a
          href={`/resources/${slug}`}
          className="mt-3.5 inline-flex min-h-[44px] items-center gap-1.5 text-[13.5px] font-bold"
          style={{ color: 'var(--green-500)' }}
        >
          Read guide →
        </a>
      </div>
    </article>
  );
}
