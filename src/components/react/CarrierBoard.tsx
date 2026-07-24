'use client';

import React, { useState } from 'react';
import type { CarrierBoardDisplayItem } from '@/types/carrier-board';

function carrierLogoSlug(carrier: string): string {
  return carrier.toLowerCase();
}

function CarrierLogo({ carrier }: { carrier: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <span className="font-display text-[11px] font-bold uppercase tracking-tight text-neutral-900">
        {carrier}
      </span>
    );
  }
  return (
    <img
      src={`/images/carriers/logo-${carrierLogoSlug(carrier)}.png`}
      alt={carrier}
      width={96}
      height={56}
      className="absolute inset-0 h-full w-full object-contain p-0.5"
      loading="eager"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

interface CarrierBoardProps {
  items: CarrierBoardDisplayItem[];
}

// ponytail: routes refresh on marketing rebuild, not realtime in-browser
export default function CarrierBoard({ items }: CarrierBoardProps) {
  return (
    <div className="w-full">
      <div
        className="overflow-hidden rounded-[var(--radius-lg)] border border-white/14 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-md"
        style={{ background: 'rgba(9,26,45,0.82)' }}
      >
        <div className="flex items-center justify-between border-b border-white/12 px-[18px] py-3.5">
          <span className="font-display inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#e6eef6]">
            <span
              className="inline-flex h-2 w-2 rounded-full"
              style={{ background: 'var(--green-500)', boxShadow: '0 0 0 3px rgba(111,190,68,0.25)' }}
            />
            Live Shipping Status
          </span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#7a97b8]">Real-time feed</span>
        </div>

        <div className="grid grid-cols-[1fr_auto_auto] gap-x-3.5 gap-y-0.5 px-[18px] py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#6b86a6]">
          <span>Destination</span>
          <span>Carrier</span>
          <span className="text-right">Status</span>
        </div>

        <div>
          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3.5 border-t border-white/[0.06] px-[18px] py-2.5"
            >
              <div>
                <div className="text-sm font-semibold text-white">{item.country}</div>
                <div className="text-[11.5px] italic text-[#7a97b8]">{item.city}</div>
              </div>
              <div className="relative flex h-10 w-16 items-center justify-center rounded-[var(--radius-sm)] border border-white/20 bg-white/90 px-2 py-1 sm:h-14 sm:w-24">
                <CarrierLogo carrier={item.carrier} />
              </div>
              <span
                className="whitespace-nowrap text-right text-[10.5px] font-bold uppercase tracking-[0.08em]"
                style={{ color: item.status === 'Available' ? 'var(--green-light)' : '#ef4444' }}
              >
                ● {item.status}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 px-[18px] py-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#6b86a6]">
          ✦ Subject to active flight schedules &amp; regional restrictions
        </div>
      </div>
    </div>
  );
}
