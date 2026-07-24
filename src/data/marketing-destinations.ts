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
