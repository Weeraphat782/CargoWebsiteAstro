'use client';

import { BRAND_NAME, LINKEDIN_URL } from '@/lib/site';
import { trackCtaClick } from '@/lib/analytics';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/newsroom', label: 'Newsroom' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

const serviceLinks = [
  { href: '/services/cannabis-export-logistics', label: 'Cannabis Export Logistics' },
  { href: '/services#specialized-air-freight', label: 'Air Freight' },
  { href: '/services#shipping-customs', label: 'Customs & Documents' },
  { href: '/services#gdp-warehousing', label: 'GDP Warehousing' },
  { href: '/services#controlled-temperature-transport', label: 'Cold Chain Transport' },
];

export default function Footer() {
  return (
    <footer className="mt-auto text-[var(--hero-muted)]" style={{ backgroundColor: 'var(--navy-950)' }}>
      <div className="marketing-container pb-0 pt-[52px]">
        <div className="grid gap-10 border-b border-white/10 pb-9 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img
              src="/logo.png"
              alt={`${BRAND_NAME} logo`}
              width={220}
              height={68}
              className="h-8 w-auto brightness-0 invert"
              loading="lazy"
              decoding="async"
            />
            <p className="mt-4 max-w-[300px] text-[13.5px] leading-relaxed" style={{ color: '#8fb4d8' }}>
              Specialized air freight and global logistics for time-sensitive, temperature-controlled, and
              compliance-critical cargo.
            </p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${BRAND_NAME} on LinkedIn`}
              className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 hover:border-white/40 hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            </a>
          </div>
          <div>
            <div className="font-display mb-4 text-[13px] font-bold uppercase tracking-[0.06em] text-white">
              Navigation
            </div>
            <nav className="flex flex-col gap-2.5 text-sm">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <div className="font-display mb-4 text-[13px] font-bold uppercase tracking-[0.06em] text-white">
              Services
            </div>
            <nav className="mb-6 flex flex-col gap-2.5 text-sm">
              {serviceLinks.map((link) => (
                <a key={link.href} href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              ))}
            </nav>
            <a
              href="/contact"
              onClick={() => trackCtaClick('Request a Quote', 'footer')}
              className="inline-flex rounded-[var(--radius-sm)] px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: 'var(--green-500)' }}
            >
              Request a Quote
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 py-8 text-xs sm:flex-row" style={{ color: '#8fb4d8' }}>
          <p>&copy; {new Date().getFullYear()} OMG Experience Co., Ltd. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1" aria-label="Legal">
            <a href="/terms-of-service" className="hover:text-white">
              Terms of Service
            </a>
            <a href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="/cookie-policy" className="hover:text-white">
              Cookie Policy
            </a>
          </nav>
          <p className="text-center sm:text-right" style={{ color: 'rgba(143,180,216,0.6)' }}>
            Supported by the National Innovation Agency (NIA), Thailand
          </p>
        </div>
      </div>
    </footer>
  );
}
