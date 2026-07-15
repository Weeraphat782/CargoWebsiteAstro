
export function ContinueExploring() {
  return (
    <section
      className="mt-16 border-t border-neutral-200 pt-12"
      aria-labelledby="continue-exploring-heading"
    >
      <h2
        id="continue-exploring-heading"
        className="text-xl font-semibold text-neutral-900"
      >
        Continue exploring
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href="/resources"
          className="flex min-h-[44px] items-center rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm font-medium text-neutral-800 transition hover:border-neutral-300 hover:bg-white"
        >
          Regulatory &amp; export resources
        </a>
        <a
          href="/newsroom"
          className="flex min-h-[44px] items-center rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm font-medium text-neutral-800 transition hover:border-neutral-300 hover:bg-white"
        >
          Latest newsroom updates
        </a>
        <a
          href="/contact"
          className="flex min-h-[44px] items-center rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm font-medium text-neutral-800 transition hover:border-neutral-300 hover:bg-white"
        >
          Talk to our logistics team
        </a>
        <a
          href="/services#qc-lab-testing"
          className="flex min-h-[44px] items-center rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 text-sm font-medium text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50"
        >
          QC lab testing for your exports
        </a>
      </div>
    </section>
  );
}
