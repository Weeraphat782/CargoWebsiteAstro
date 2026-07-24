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

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    setPathname(window.location.pathname);
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
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white">
      <div className="marketing-container flex h-[70px] items-center gap-6">
        <a href="/" className="flex shrink-0 items-center">
          <img src="/logo.png" alt={`${BRAND_NAME} logo`} width={220} height={68} className="h-[34px] w-auto" />
        </a>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className="font-display px-3.5 py-2 text-[14.5px] font-semibold transition-colors"
                style={{
                  color: active ? 'var(--navy-700)' : 'var(--muted)',
                  borderBottom: active ? '2px solid var(--navy-700)' : '2px solid transparent',
                  marginBottom: '-2px',
                }}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-2.5">
          <a
            href={registerUrl}
            className="hidden rounded-[var(--radius-sm)] border-[1.5px] px-4 py-1.5 text-sm font-semibold sm:inline-block"
            style={{ borderColor: 'var(--line-strong)', color: 'var(--navy-700)' }}
          >
            Register
          </a>
          <a
            href={loginUrl}
            className="hidden rounded-[var(--radius-sm)] px-[17px] py-2 text-sm font-semibold text-white sm:inline-block"
            style={{ backgroundColor: 'var(--green-500)' }}
          >
            Login
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] md:hidden"
            style={{ color: 'var(--navy-700)' }}
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

      {mobileMenuOpen && (
        <div className="border-t border-[var(--line)] bg-white md:hidden">
          <nav className="marketing-container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-display min-h-[44px] px-2 py-3 text-sm font-semibold"
                style={{ color: 'var(--navy-700)' }}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex gap-2 border-t border-[var(--line)] pt-3">
              <a
                href={registerUrl}
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-[var(--radius-sm)] border text-sm font-semibold"
                style={{ borderColor: 'var(--line-strong)', color: 'var(--navy-700)' }}
              >
                Register
              </a>
              <a
                href={loginUrl}
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-[var(--radius-sm)] text-sm font-semibold text-white"
                style={{ backgroundColor: 'var(--green-500)' }}
              >
                Login
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
