import type { ServiceIconId } from '@/components/ServiceIcon';

export const serviceIds = {
  specializedAirFreight: 'specialized-air-freight',
  shippingCustoms: 'shipping-customs',
  gdpWarehousing: 'gdp-warehousing',
  controlledTempTransport: 'controlled-temperature-transport',
  qcLabTesting: 'qc-lab-testing',
} as const;

export type ServiceId = (typeof serviceIds)[keyof typeof serviceIds];

/** Home grid order — matches OMGEXP-Website.dc.html servicesShort */
export const homeServiceOrder: ServiceId[] = [
  serviceIds.specializedAirFreight,
  serviceIds.controlledTempTransport,
  serviceIds.qcLabTesting,
  serviceIds.shippingCustoms,
];

export type MarketingService = {
  id: ServiceId;
  title: string;
  tag: string;
  icon: ServiceIconId;
  imageUrl: string;
  shortDescription: string;
  fullDescription: string;
  points: string[];
  /** Optional HTML body for service detail pages */
  extraBody?: string;
};

export const services: MarketingService[] = [
  {
    id: serviceIds.specializedAirFreight,
    title: 'Specialized Air Freight',
    tag: 'Air Freight',
    icon: 'air',
    imageUrl: '/images/air-freight.jpg',
    shortDescription:
      'Time-critical air cargo for cannabis, hemp, and kratom exports from Bangkok (BKK) with documented handoffs.',
    fullDescription:
      'OMG Experience delivers specialized air freight for licensed cannabis, hemp, and kratom exports from Bangkok. Our airline heritage provides routing intelligence, capacity across major hubs, and optimal transit times to eight published destination countries — with documented chain-of-custody at every stage.',
    points: [
      'Bangkok (BKK) origin on published EU, Oceania, and Africa lanes',
      'Routing intelligence from airline distribution heritage',
      'Documented chain-of-custody handoffs to partner GDP facilities',
    ],
  },
  {
    id: serviceIds.shippingCustoms,
    title: 'Shipping & Customs',
    tag: 'Customs',
    icon: 'customs',
    imageUrl: '/images/shipping-customs.jpg',
    shortDescription:
      'Export documentation for Thai controlled herbs — ภ.ท.10 licence, ภ.ท.32 per-shipment notification, and destination import files.',
    fullDescription:
      'International cannabis and hemp exports demand rigorous customs files. We prepare and verify import/export permits, controlled-herb notifications, certificates of origin, phytosanitary evidence where required, and National Single Window filings — aligned to DTAM and destination regulator requirements.',
    extraBody: `<p>Common Thai export forms we coordinate with shippers:</p>
<ul>
<li><strong>ภ.ท.9 / ภ.ท.10</strong> — controlled-herb export licence application and licence</li>
<li><strong>ภ.ท.32 (Form T.K. 32)</strong> — per-shipment export notification (valid up to 180 days; filed before each departure)</li>
<li><strong>ภ.ท.27–31</strong> — cultivation, sales, and monthly returns where applicable</li>
<li>GACP certificates or COA from the producer; destination import permit where required</li>
<li>Certificate of Origin and phytosanitary certificate when the lane requires them</li>
</ul>
<p><em>Last verified against Thai FDA / DTAM form guidance: 2026-08-05.</em></p>`,
    points: [
      'ภ.ท.32 per-shipment notifications aligned to DTAM rules',
      'Destination import permit cross-check before booking',
      'AI-assisted document verification via Export Portal',
    ],
  },
  {
    id: serviceIds.gdpWarehousing,
    title: 'GDP Warehousing (Partner)',
    tag: 'Warehousing',
    icon: 'warehouse',
    imageUrl: '/images/gdp-warehousing.jpg',
    shortDescription:
      'GDP-compliant packing and storage through our certified partner — OMG Experience is not GDP-certified.',
    fullDescription:
      'Packing, palletizing, and GDP-compliant storage for cannabis and hemp exports are performed through our certified partner facilities. OMG Experience coordinates air freight and documented handoffs into and out of partner warehousing — we do not operate GDP-certified warehouses ourselves.',
    points: [
      'Partner-operated GDP-compliant secure storage',
      'Cold-chain verification and audit trails at partner sites',
      'Packing, palletizing, and labelling before air departure',
    ],
  },
  {
    id: serviceIds.controlledTempTransport,
    title: 'Controlled Temperature Transport',
    tag: 'Cold Chain',
    icon: 'cold',
    imageUrl: '/images/truck-temp.jpg',
    shortDescription:
      'Validated cold-chain logistics with documented handling for temperature-sensitive cannabis material.',
    fullDescription:
      'Temperature-sensitive cannabis and hemp material requires validated transport from farm or partner warehouse to Bangkok airport. We coordinate controlled temperature transport with validated packaging and documented cold-chain handling — ambient, chilled, and frozen ranges — with monitoring records supporting import compliance.',
    points: [
      'Ambient, chilled, and frozen ranges',
      'Validated packaging solutions',
      'Temperature records supporting airway bill and import dossier',
    ],
  },
  {
    id: serviceIds.qcLabTesting,
    title: 'QC Lab Testing (Partner)',
    tag: 'Partner Lab',
    icon: 'flask',
    imageUrl: '/images/qc-lab-testing.jpg',
    shortDescription:
      'Full-panel COA from our ISO-certified, GACP-aligned partner lab — integrated via Export Portal.',
    fullDescription:
      'Submit export samples through the Export Portal for a transparent QC quote with itemized pricing. Every sample receives QR-tracked handling from receipt through testing to Certificate of Analysis (COA) delivery. Testing is performed by our ISO-certified, GACP-aligned partner laboratory — OMG Experience does not operate the lab or hold ISO certification.',
    points: [
      'Instant QC quote with itemized pricing',
      'QR-tracked sample lifecycle via Export Portal',
      'COA delivered online before departure',
    ],
  },
];

export function serviceById(id: ServiceId): MarketingService | undefined {
  return services.find((s) => s.id === id);
}
