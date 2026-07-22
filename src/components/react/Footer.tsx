'use client';

import { BRAND_NAME } from '@/lib/site';
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
    <footer style={{ backgroundColor: 'var(--color-primary-ref)' }}>
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, var(--color-accent-ref), #86ef6c, var(--color-accent-ref))' }} />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3 sm:gap-12">
          <div>
            <a href="/" className="inline-block mb-4">
              <img src="/logo.png" alt={`${BRAND_NAME} logo`} width={220} height={68} className="h-12 w-auto brightness-0 invert" />
            </a>
            <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-xs">
              Specialized air freight and global logistics for time-sensitive, temperature-controlled, and compliance-critical cargo.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Navigation</h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="inline-flex min-h-[44px] items-center text-sm text-white/80 hover:text-white">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Services</h3>
            <nav className="flex flex-col gap-2 mb-8">
              {serviceLinks.map((link) => (
                <a key={link.href} href={link.href} className="inline-flex min-h-[44px] items-center text-sm text-white/80 hover:text-white">
                  {link.label}
                </a>
              ))}
            </nav>
            <a
              href="/contact"
              onClick={() => trackCtaClick('Request a Quote', 'footer')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: 'var(--color-accent-ref)' }}
            >
              Request a Quote
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/50">&copy; {new Date().getFullYear()} OMG Experience Co., Ltd. All rights reserved.</p>
          <p className="text-xs text-white/30">Supported by the National Innovation Agency (NIA), Thailand</p>
        </div>
      </div>
    </footer>
  );
}
