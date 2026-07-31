export const destinationRegions = [
  {
    name: 'Europe',
    dests: [
      { country: 'Switzerland', city: 'Zurich' },
      { country: 'Germany', city: 'Frankfurt' },
      { country: 'Czech Republic', city: 'Prague' },
      { country: 'Portugal', city: 'Lisbon' },
      { country: 'Macedonia', city: 'Skopje' },
    ],
  },
  {
    name: 'Oceania',
    dests: [
      { country: 'Australia', city: 'Sydney · Melbourne' },
      { country: 'New Zealand', city: 'Auckland' },
    ],
  },
  {
    name: 'Africa',
    dests: [{ country: 'South Africa', city: 'Johannesburg' }],
  },
] as const;

/** Unique destination countries — single source for stats + schema areaServed. */
export const destinationCountryNames = [
  ...new Set(destinationRegions.flatMap((r) => r.dests.map((d) => d.country))),
] as const;

export function serviceAreaCountries(): { '@type': 'Country'; name: string }[] {
  return [
    { '@type': 'Country', name: 'Thailand' },
    ...destinationCountryNames.map((name) => ({ '@type': 'Country', name })),
  ];
}
