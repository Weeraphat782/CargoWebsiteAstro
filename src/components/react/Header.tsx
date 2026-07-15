'use client';

import { APP_URL, BRAND_NAME } from '@/lib/site';
import { useState, useEffect } from 'react';

const loginUrl = `${APP_URL}/site/login`;
const registerUrl = `${APP_URL}/site/register`;

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/newsroom', label: 'Newsroom' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [mobileMenuOpen]);

  return (
    <header
      className={`transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-neutral-200/60'
          : 'bg-white border-b border-neutral-200'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-3 sm:px-8 lg:px-10">
        <a href="/" className="flex shrink-0 items-center">
          <img
            src="/logo.png"
            alt={`${BRAND_NAME} logo`}
            width={360}
            height={112}
            className="h-10 w-auto sm:h-12 lg:h-14 xl:h-[60px]"
          />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link inline-block text-sm font-medium"
              style={{ color: 'var(--color-primary-ref)' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href={registerUrl}
            className="hidden rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-200 hover:shadow-sm sm:inline-block"
            style={{ borderColor: 'var(--color-primary-ref)', color: 'var(--color-primary-ref)' }}
          >
            Register
          </a>
          <a
            href={loginUrl}
            className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 sm:inline-block"
            style={{ backgroundColor: 'var(--color-accent-ref)' }}
          >
            Login
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-lg transition hover:bg-neutral-100 md:hidden"
            style={{ color: 'var(--color-primary-ref)' }}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out md:hidden border-b border-neutral-200 ${
          mobileMenuOpen ? 'max-h-[calc(100dvh-9rem)] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="max-h-[calc(100dvh-9rem)] overflow-y-auto border-t border-neutral-200 bg-white/95 px-4 py-6">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-4 py-3.5 text-sm font-medium hover:bg-neutral-50"
                style={{ color: 'var(--color-primary-ref)' }}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex gap-2 border-t border-neutral-100 pt-3">
              <a href={registerUrl} className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg border px-4 py-3 text-sm font-semibold" style={{ borderColor: 'var(--color-primary-ref)', color: 'var(--color-primary-ref)' }}>
                Register
              </a>
              <a href={loginUrl} className="flex min-h-[44px] flex-1 items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white" style={{ backgroundColor: 'var(--color-accent-ref)' }}>
                Login
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
