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
};

export const services: MarketingService[] = [
  {
    id: serviceIds.specializedAirFreight,
    title: 'Specialized Air Freight',
    tag: 'Air Freight',
    icon: 'air',
    imageUrl: '/images/air-freight.jpg',
    shortDescription:
      'Time-critical air cargo solutions with routing intelligence and documented handoffs.',
    fullDescription:
      'OMG Experience delivers specialized air freight for time-sensitive and high-value cargo. Our airline heritage provides direct access to routing intelligence, capacity availability and optimal transit times across major global hubs. We manage the full lifecycle of your shipment with documented handoffs at every stage.',
    points: [
      'Direct routing intelligence from airline heritage',
      'Capacity across major global hubs',
      'Documented chain-of-custody handoffs',
    ],
  },
  {
    id: serviceIds.shippingCustoms,
    title: 'Shipping & Customs',
    tag: 'Customs',
    icon: 'customs',
    imageUrl: '/images/shipping-customs.jpg',
    shortDescription:
      'End-to-end customs clearance support with document preparation and compliance expertise.',
    fullDescription:
      'International shipping demands rigorous attention to customs regulations, documentation and compliance. We provide comprehensive shipping and customs services — document preparation, import/export permits and clearance coordination — with specialists who stay current on evolving regulatory requirements.',
    points: [
      'Import/export permit preparation',
      'Clearance coordination end to end',
      'AI-assisted document verification',
    ],
  },
  {
    id: serviceIds.gdpWarehousing,
    title: 'GDP Warehousing',
    tag: 'Warehousing',
    icon: 'warehouse',
    imageUrl: '/images/gdp-warehousing.jpg',
    shortDescription:
      'Pharmaceutical-grade storage in temperature-controlled conditions with full compliance documentation.',
    fullDescription:
      'Our Good Distribution Practice (GDP) compliant facilities are designed for pharmaceutical and temperature-sensitive products. We offer secure storage, packing, palletizing and cold-chain verification with full audit trails and documented handling at every step.',
    points: [
      'GDP-compliant secure storage',
      'Cold-chain verification & audit trails',
      'Packing, palletizing & labelling',
    ],
  },
  {
    id: serviceIds.controlledTempTransport,
    title: 'Controlled Temperature Transport',
    tag: 'Cold Chain',
    icon: 'cold',
    imageUrl: '/images/truck-temp.jpg',
    shortDescription:
      'Validated cold-chain logistics with documented handling for temperature-sensitive cargo.',
    fullDescription:
      'Temperature-sensitive cargo requires validated transport from origin to destination. We provide controlled temperature transport with validated packaging and documented cold-chain handling — covering ambient, chilled and frozen requirements across the journey.',
    points: [
      'Ambient, chilled and frozen ranges',
      'Validated packaging solutions',
      'Live temperature logging to airway bill',
    ],
  },
  {
    id: serviceIds.qcLabTesting,
    title: 'QC Lab Testing',
    tag: 'New Service',
    icon: 'flask',
    imageUrl: '/images/qc-lab-testing.jpg',
    shortDescription:
      'GACP-aligned partner lab, portal-integrated — QR-tracked samples with COA results online.',
    fullDescription:
      'Submit export samples through the Export Portal and receive a transparent QC quote with itemized pricing. Every sample gets a QR code for live tracking from receipt through testing to Certificate of Analysis (COA) delivery. Our integrated lab partner supports GACP-aligned testing.',
    points: [
      'Instant QC quote with itemized pricing',
      'QR-tracked sample lifecycle',
      'COA delivered online before departure',
    ],
  },
];

export function serviceById(id: ServiceId): MarketingService | undefined {
  return services.find((s) => s.id === id);
}
