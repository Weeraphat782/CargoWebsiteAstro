'use client';

import { useEffect, useState } from 'react';

const SEGMENT_LABELS: Record<string, string> = {
  about: 'About',
  contact: 'Contact',
  services: 'Services',
  newsroom: 'Newsroom',
  resources: 'Resources',
};

function labelForSegment(seg: string): string {
  return SEGMENT_LABELS[seg] || seg.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function MarketingBreadcrumbNav() {
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  if (!pathname || pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);
  const items: { href: string; label: string }[] = [{ href: '/', label: 'Home' }];

  let acc = '';
  for (const seg of segments) {
    acc += `/${seg}`;
    items.push({ href: acc, label: labelForSegment(seg) });
  }

  return (
    <nav aria-label="Breadcrumb" className="border-b border-neutral-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-600">
          {items.map((item, idx) => (
            <li key={item.href} className="flex items-center gap-2">
              {idx > 0 && <span className="text-neutral-400" aria-hidden>/</span>}
              {idx === items.length - 1 ? (
                <span className="font-medium text-neutral-900">{item.label}</span>
              ) : (
                <a href={item.href} className="hover:text-neutral-900 hover:underline">{item.label}</a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
