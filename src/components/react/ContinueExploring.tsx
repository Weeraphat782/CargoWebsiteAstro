
export function ContinueExploring() {
  const tile =
    'rounded-[3px] border border-[var(--line)] p-4 text-left text-sm font-semibold transition hover:border-[var(--navy-700)] hover:bg-[#f2f6fb]';
  return (
    <section aria-labelledby="continue-exploring-heading">
      <div
        className="mb-4 text-[13px] font-bold uppercase tracking-[0.06em]"
        style={{ color: '#7a838c' }}
        id="continue-exploring-heading"
      >
        Continue exploring
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <a href="/resources" className={tile} style={{ color: 'var(--navy-700)' }}>
          Regulatory &amp; export resources →
        </a>
        <a href="/newsroom" className={tile} style={{ color: 'var(--navy-700)' }}>
          Latest newsroom updates →
        </a>
        <a href="/contact" className={tile} style={{ color: 'var(--navy-700)' }}>
          Talk to our logistics team →
        </a>
        <a
          href="/services#qc-lab-testing"
          className="rounded-[3px] border p-4 text-left text-sm font-semibold transition hover:border-[var(--green-500)]"
          style={{ borderColor: '#b6dd97', background: '#eaf6e0', color: '#3d6b26' }}
        >
          QC lab testing for your exports →
        </a>
      </div>
    </section>
  );
}
