'use client';

import { useState } from 'react';

export default function PartnerSection() {
  const [niaLogoError, setNiaLogoError] = useState(false);
  return (
    <section style={{ background: 'linear-gradient(115deg,var(--navy-950),var(--navy-700))' }} className="py-[60px] text-white">
      <div className="marketing-container text-center">
        <div className="accent-bar mx-auto mb-4" />
        <h2 className="font-display text-[28px] font-bold">Innovation Fueled by Partnership</h2>
        <p className="mx-auto mt-3 max-w-[620px] text-[15px] leading-relaxed" style={{ color: 'var(--hero-muted)' }}>
          OMG Experience is proud to be part of the Thai innovation ecosystem. Our AI-powered logistics
          platform is funded and supported by the{' '}
          <strong className="text-white">National Innovation Agency (Public Organization)</strong>, or NIA,
          Thailand.
        </p>
        <div className="mt-8 inline-flex flex-col items-center gap-1 rounded-[var(--radius-lg)] bg-white px-11 py-7 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
          {!niaLogoError ? (
            <img
              src="/images/partners/nia-logo.png"
              alt="National Innovation Agency Thailand"
              width={200}
              height={80}
              className="h-16 w-auto object-contain"
              onError={() => setNiaLogoError(true)}
            />
          ) : (
            <span className="font-display text-[40px] font-extrabold tracking-wide" style={{ color: '#1b3a6b' }}>
              NIA
            </span>
          )}
          <span className="text-[11px] tracking-[0.06em]" style={{ color: '#7a838c' }}>
            National Innovation Agency · Thailand
          </span>
        </div>
      </div>
    </section>
  );
}
