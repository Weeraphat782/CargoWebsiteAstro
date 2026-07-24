'use client';

import { BRAND_NAME, APP_URL } from '@/lib/site';
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
            <img src="/logo.png" alt={`${BRAND_NAME} logo`} width={220} height={68} className="h-8 w-auto brightness-0 invert" />
            <p className="mt-4 max-w-[300px] text-[13.5px] leading-relaxed" style={{ color: '#8fb4d8' }}>
              Specialized air freight and global logistics for time-sensitive, temperature-controlled, and
              compliance-critical cargo.
            </p>
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
          <p style={{ color: 'rgba(143,180,216,0.6)' }}>Supported by the National Innovation Agency (NIA), Thailand</p>
        </div>
      </div>
    </footer>
  );
}
