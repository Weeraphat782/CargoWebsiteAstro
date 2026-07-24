'use client';

import { APP_URL } from '@/lib/site';
import { homeServiceOrder, serviceById } from '@/data/marketing-services';
import { ServiceIcon } from '@/components/ServiceIcon';
import PartnerSection from '@/components/react/PartnerSection';
import { trackCtaClick } from '@/lib/analytics';
import { destinationRegions } from '@/data/marketing-destinations';
import DocumentIntelligenceDemo from '@/components/react/DocumentIntelligenceDemo';

const homeServices = homeServiceOrder.map((id) => serviceById(id)).filter((s): s is NonNullable<typeof s> => !!s);

const aiTags = ['Error Detection', 'Compliance Check', 'Batch Processing', 'Region Rules'];
const qcTags = ['Lab Testing', 'QR Tracked', 'COA Online', 'GACP-aligned'];

const continueTile =
  'rounded-[3px] border border-[var(--line)] p-4 text-left text-sm font-semibold transition hover:border-[var(--navy-700)] hover:bg-[#f2f6fb]';

function HomeContinueExploring() {
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
        <a href="/resources" className={continueTile} style={{ color: 'var(--navy-700)' }}>
          Regulatory &amp; export resources →
        </a>
        <a href="/newsroom" className={continueTile} style={{ color: 'var(--navy-700)' }}>
          Latest newsroom updates →
        </a>
        <a href="/contact" className={continueTile} style={{ color: 'var(--navy-700)' }}>
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

export default function MarketingHomePageClient() {
  return (
    <div>
      <section className="marketing-container grid gap-5 pt-8 sm:grid-cols-2">
        <a
          href="/newsroom"
          className="flex items-center gap-4 rounded border border-[var(--line)] bg-white p-5 transition hover:border-[var(--line-strong)] hover:shadow-[var(--shadow-1)]"
        >
          <span className="flex-1">
            <span className="font-display block text-base font-bold" style={{ color: 'var(--navy-950)' }}>
              Newsroom
            </span>
            <span className="block text-[13.5px]" style={{ color: 'var(--muted)' }}>
              Latest logistics updates
            </span>
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--green-500)' }}>
            Read news →
          </span>
        </a>
        <a
          href="/resources"
          className="flex items-center gap-4 rounded border border-[var(--line)] bg-white p-5 transition hover:border-[var(--line-strong)] hover:shadow-[var(--shadow-1)]"
        >
          <span className="flex-1">
            <span className="font-display block text-base font-bold" style={{ color: 'var(--navy-950)' }}>
              Resources
            </span>
            <span className="block text-[13.5px]" style={{ color: 'var(--muted)' }}>
              Regulatory &amp; export guides
            </span>
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--green-500)' }}>
            Browse guides →
          </span>
        </a>
      </section>

      {/* Services grid */}
      <section className="marketing-container py-16">
        <div className="mb-10 text-center">
          <div className="accent-bar mx-auto mb-4" />
          <h2 className="font-display text-4xl font-bold" style={{ color: 'var(--navy-950)' }}>
            Our Services
          </h2>
          <p className="mx-auto mt-2.5 max-w-[560px] text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
            Comprehensive logistics solutions tailored to pharmaceutical, perishable and time-critical cargo.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {homeServices.map((s) => (
            <a
              key={s.id}
              href={`/services#${s.id}`}
              className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-white text-left transition hover:shadow-[var(--shadow-2)]"
            >
              <div className="relative h-[150px]">
                <img src={s.imageUrl} alt={s.title} className="h-full w-full object-cover" loading="lazy" decoding="async" fetchPriority="low" />
                <span
                  className="absolute left-3 top-3 flex h-[34px] w-[34px] items-center justify-center rounded-[3px] text-white shadow-md"
                  style={{ background: 'var(--navy-700)' }}
                >
                  <ServiceIcon id={s.icon} size={16} strokeWidth={2} />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-[18px]">
                <h3 className="font-display text-[17px] font-bold leading-tight" style={{ color: 'var(--navy-950)' }}>
                  {s.title}
                </h3>
                <p className="mt-2 flex-1 text-[13.5px] leading-snug" style={{ color: 'var(--muted)' }}>
                  {s.shortDescription}
                </p>
                <span className="mt-3.5 text-[13.5px] font-bold" style={{ color: 'var(--green-500)' }}>
                  Learn more →
                </span>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="/services" className="text-[15px] font-bold" style={{ color: 'var(--green-500)' }}>
            View all services →
          </a>
        </div>
      </section>

      {/* AI Edge */}
      <section className="border-y border-[#eef1f4] bg-[var(--paper-muted)]">
        <div className="marketing-container grid items-center gap-14 py-16 lg:grid-cols-2">
          <DocumentIntelligenceDemo />
          <div>
            <div className="accent-bar mb-4" />
            <h2 className="font-display text-[32px] font-bold leading-tight" style={{ color: 'var(--navy-950)' }}>
              Our Edge: AI-Powered
              <br />
              <span style={{ color: 'var(--navy-500)' }}>Document Intelligence</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed" style={{ color: '#444c54' }}>
              Before your shipment departs, our AI-powered platform manages, reviews and verifies every
              document in your export workflow — from customs declarations to compliance permits —
              identifying errors, flagging missing requirements and ensuring complete documentation to
              reduce delays and border rejections.
            </p>
            <p className="mt-3.5 text-[15px] leading-relaxed" style={{ color: '#444c54' }}>
              Integrated with Cantrak for batch verification, we streamline high-volume document
              processing to support scalable operations.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {aiTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-3 py-1.5 text-[12.5px] font-semibold"
                  style={{ borderColor: 'var(--line-strong)', color: 'var(--navy-700)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href="/contact"
              onClick={() => trackCtaClick('Discuss your requirements', 'edge-section')}
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-6 py-3 text-[15px] font-semibold text-white"
              style={{ background: 'var(--navy-700)' }}
            >
              Discuss your requirements →
            </a>
          </div>
        </div>
      </section>

      {/* QC band */}
      <section className="scroll-mt-24" style={{ background: 'linear-gradient(100deg,#eaf6e0,#f4fbee)' }}>
        <div className="marketing-container grid items-center gap-10 py-[52px] lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span
              className="mb-3.5 inline-block rounded-[var(--radius-sm)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white"
              style={{ background: 'var(--green-500)' }}
            >
              New Service
            </span>
            <h2 className="font-display text-[30px] font-bold text-[var(--ink)]">QC Lab Testing</h2>
            <div className="font-display text-[26px] font-bold" style={{ color: '#4a8a2d' }}>
              COA before your cargo flies
            </div>
            <p className="mt-3.5 max-w-[560px] text-[15px] leading-relaxed" style={{ color: '#3d4a38' }}>
              Submit samples through the Export Portal, get an instant QC quote, and track every sample
              with a QR code — from lab receipt to Certificate of Analysis online, before your shipment
              departs.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {qcTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ borderColor: '#97c47c', color: '#3d6b26', background: 'rgba(255,255,255,.5)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href={`${APP_URL}/site/login`}
              className="rounded-[var(--radius-sm)] py-3.5 text-center text-[15px] font-semibold text-white"
              style={{ background: 'var(--green-500)' }}
            >
              Request QC in Portal
            </a>
            <a
              href="/services#qc-lab-testing"
              className="rounded-[var(--radius-sm)] border py-3.5 text-center text-[15px] font-semibold"
              style={{ borderColor: '#97c47c', color: '#3d6b26', background: '#fff' }}
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="marketing-container py-16">
        <div className="mb-9 text-center">
          <div className="accent-bar mx-auto mb-4" />
          <h2 className="font-display text-[34px] font-bold" style={{ color: 'var(--navy-950)' }}>
            Destinations We Serve
          </h2>
          <p className="mx-auto mt-2.5 max-w-[600px] text-base leading-relaxed" style={{ color: 'var(--muted)' }}>
            Connecting Thailand to global markets across Europe, Oceania and Africa — with compliant,
            documented air freight on every route.
          </p>
        </div>
        <div
          className="relative overflow-hidden rounded-lg px-6 py-11 text-white sm:px-8 lg:px-12"
          style={{
            background: 'linear-gradient(120deg,#0d2c4d,#184878 70%,#1f5990)',
          }}
        >
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-[280px] w-[280px] rounded-full border-2"
            style={{ borderColor: 'rgba(111,190,68,.14)' }}
            aria-hidden
          />
          <div className="relative mb-7 flex items-center gap-3.5">
            <span
              className="inline-flex h-[46px] w-[46px] items-center justify-center rounded-[3px]"
              style={{ background: 'rgba(111,190,68,.2)', color: '#8ccd6a' }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </span>
            <div>
              <div className="font-display text-[19px] font-bold">Origin hub · Bangkok (BKK)</div>
              <div className="text-[13px]" style={{ color: '#9fb6cf' }}>
                Daily uplift to 7+ international destinations
              </div>
            </div>
          </div>
          <div className="relative grid gap-6 md:grid-cols-3">
            {destinationRegions.map((reg) => (
              <div key={reg.name}>
                <div
                  className="font-display mb-3 text-xs font-bold uppercase tracking-[0.1em]"
                  style={{ color: '#8ccd6a' }}
                >
                  {reg.name}
                </div>
                <div className="flex flex-col gap-2.5">
                  {reg.dests.map((d) => (
                    <div
                      key={`${d.country}-${d.city}`}
                      className="flex items-center justify-between rounded-[3px] border border-white/10 bg-white/[0.06] px-3.5 py-2.5"
                    >
                      <span className="text-sm font-semibold">{d.country}</span>
                      <span className="text-[11.5px] italic" style={{ color: '#9fb6cf' }}>
                        {d.city}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnerSection />

      <div className="marketing-container pb-12 pt-4">
        <HomeContinueExploring />
      </div>
    </div>
  );
}
