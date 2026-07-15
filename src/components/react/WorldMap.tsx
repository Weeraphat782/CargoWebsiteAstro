'use client';

import React, { lazy, Suspense } from 'react';

const ComposableMap = lazy(() => import('react-simple-maps').then((m) => ({ default: m.ComposableMap })));
const Geographies = lazy(() => import('react-simple-maps').then((m) => ({ default: m.Geographies })));
const Geography = lazy(() => import('react-simple-maps').then((m) => ({ default: m.Geography })));
const Marker = lazy(() => import('react-simple-maps').then((m) => ({ default: m.Marker })));
const Line = lazy(() => import('react-simple-maps').then((m) => ({ default: m.Line })));

const geoUrl = 'https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json';
const thailand: [number, number] = [100.9925, 15.87];
const destinations = [
  { name: 'Switzerland', coords: [8.2275, 46.8182] as [number, number], offset: [0, -12] as [number, number], align: 'end' as const },
  { name: 'Portugal', coords: [-8.2245, 39.3999] as [number, number], offset: [-10, 0] as [number, number], align: 'end' as const },
  { name: 'Australia', coords: [133.7751, -25.2744] as [number, number], offset: [0, 22] as [number, number], align: 'middle' as const },
  { name: 'Czech Republic', coords: [15.473, 49.8175] as [number, number], offset: [0, -12] as [number, number], align: 'start' as const },
  { name: 'North Macedonia', coords: [21.7453, 41.6086] as [number, number], offset: [0, 22] as [number, number], align: 'middle' as const },
  { name: 'South Africa', coords: [22.9375, -30.5595] as [number, number], offset: [0, 22] as [number, number], align: 'middle' as const },
  { name: 'Uganda', coords: [32.2903, 1.3733] as [number, number], offset: [0, 22] as [number, number], align: 'middle' as const },
];

const PRIMARY = '#215497';
const PRIMARY_DARK = '#1a4279';
const ACCENT = '#5BBF21';
const ACCENT_LIGHT = '#86ef6c';

export default function WorldMap() {
  return (
    <div
      className="relative h-[300px] w-full overflow-hidden rounded-2xl shadow-2xl sm:h-[450px] lg:h-[550px]"
      style={{ background: `linear-gradient(135deg, ${PRIMARY_DARK} 0%, ${PRIMARY} 50%, #0f2847 100%)` }}
    >
      <Suspense fallback={<div className="h-full animate-pulse bg-white/5" />}>
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140, center: [20, 20] }} width={800} height={550} className="h-full w-full opacity-80">
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} fill={PRIMARY_DARK} stroke="#2a5a9e" strokeWidth={0.5} />
              ))
            }
          </Geographies>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={ACCENT} stopOpacity="0.2" />
              <stop offset="50%" stopColor={ACCENT_LIGHT} stopOpacity="1" />
              <stop offset="100%" stopColor={ACCENT} stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {destinations.map((dest, i) => (
            <g key={`route-${i}`}>
              <Line from={thailand} to={dest.coords} stroke={ACCENT} strokeWidth={3} strokeLinecap="round" opacity={0.05} />
              <Line from={thailand} to={dest.coords} stroke="url(#lineGradient)" strokeWidth={1.5} strokeLinecap="round" className="animate-line-flow" />
            </g>
          ))}
          {destinations.map((dest) => (
            <Marker key={dest.name} coordinates={dest.coords}>
              <circle r={12} fill="transparent" stroke={ACCENT} strokeWidth={1} className="radar-ring" />
              <circle r={5} fill="#fff" stroke={ACCENT} strokeWidth={1.5} />
            </Marker>
          ))}
          <Marker coordinates={thailand}>
            <circle r={18} fill={`${ACCENT}33`} className="radar-ring" />
            <circle r={8} fill={ACCENT} stroke="#fff" strokeWidth={2.5} />
          </Marker>
        </ComposableMap>
      </Suspense>
    </div>
  );
}
