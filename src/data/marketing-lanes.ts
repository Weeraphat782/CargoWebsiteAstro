export type ExportLane = {
  slug: string;
  country: string;
  gateway: string;
  region: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  regulator: string;
  regulatorUrl: string;
  lastVerified: string;
  transitDays: string;
  permits: string[];
  qualityGate: string;
  honestNote?: string;
  faqs: { question: string; answer: string }[];
};

export const exportLanes: ExportLane[] = [
  {
    slug: 'germany',
    country: 'Germany',
    gateway: 'Frankfurt (FRA) · Munich (MUC)',
    region: 'Europe',
    title: 'Export cannabis from Thailand to Germany',
    metaTitle: 'Thailand to Germany Cannabis Export',
    metaDescription:
      'Bangkok air freight to Germany — BfArM MedCanG §4 licence and §12 per-shipment import authorisation, EU-GMP routing, and documented cold chain from OMG Experience.',
    regulator: 'BfArM (Bundesopiumstelle)',
    regulatorUrl: 'https://www.bfarm.de/DE/Bundesopiumstelle/Medizinisches-Cannabis/_node.html',
    lastVerified: '2026-08-05',
    transitDays: '2–4 days air ex-BKK to FRA/MUC',
    permits: [
      'Thai ภ.ท.10 export licence plus ภ.ท.32 per-shipment notification (DTAM)',
      '§ 4 MedCanG general licence from BfArM to import, trade, or distribute medical cannabis',
      '§ 12 MedCanG per-consignment import authorisation for each shipment',
      'EU-GMP evidence on the manufacturing or processing route; EU-GACP on Thai starting material',
    ],
    qualityGate:
      'Germany imported 50,539 kg in Q1 2026 (as reported from BfArM data via trade press, May–June 2026) — up ~34% year on year and down ~15% quarter on quarter. Thai flower typically routes as EU-GMP-aligned starting material, not finished pharmacy product.',
    faqs: [
      {
        question: 'Does OMG Experience fly cannabis to Frankfurt or Munich?',
        answer:
          'We publish scheduled Bangkok (BKK) lanes to Frankfurt and Munich when shippers hold valid Thai export permits and the German importer holds BfArM authorisations. Final routing depends on carrier acceptance and product classification.',
      },
      {
        question: 'What does the German importer need before we book air freight?',
        answer:
          'A § 4 MedCanG licence and a § 12 import authorisation for the specific consignment. We align shipment files with the importer’s permit references before departure.',
      },
    ],
  },
  {
    slug: 'switzerland',
    country: 'Switzerland',
    gateway: 'Zurich (ZUR)',
    region: 'Europe',
    title: 'Export cannabis from Thailand to Switzerland',
    metaTitle: 'Thailand to Switzerland Cannabis Export',
    metaDescription:
      'Bangkok to Zurich air freight for medical cannabis — Swissmedic establishment licence, single import permits, and GMP/GDP preconditions for controlled-substance handling.',
    regulator: 'Swissmedic',
    regulatorUrl:
      'https://www.swissmedic.ch/swissmedic/de/home/humanarzneimittel/besondere-arzneimittelgruppen--ham-/narcotics/cannabis-agency.html',
    lastVerified: '2026-08-05',
    transitDays: '2–3 days air ex-BKK to ZUR',
    permits: [
      'Thai ภ.ท.10 export licence plus ภ.ท.32 per-shipment notification',
      'Swissmedic establishment licence for handling controlled substances (Betriebsbewilligung)',
      'Single import permit (Einfuhrbewilligung) per transaction — max ~4 months validity',
    ],
    qualityGate:
      'Swissmedic states GMP/GDP certification is a precondition for obtaining a licence to handle medical cannabis. Distribution is classified as handling non-ready-to-use intermediates or active substances.',
    faqs: [
      {
        question: 'Is Switzerland in the EU customs union for our lanes?',
        answer:
          'No. Switzerland is a separate market with Swissmedic narcotics rules. Documentation and import permits follow Swiss law, not EU mutual recognition alone.',
      },
    ],
  },
  {
    slug: 'australia',
    country: 'Australia',
    gateway: 'Sydney (SYD) · Melbourne (MEL)',
    region: 'Oceania',
    title: 'Export cannabis from Thailand to Australia',
    metaTitle: 'Thailand to Australia Cannabis Export',
    metaDescription:
      'Bangkok air freight to Sydney and Melbourne — ODC licence and per-shipment permit, TGO 93 quality evidence, and GDP cold chain through partner facilities.',
    regulator: 'Office of Drug Control (ODC) · TGA',
    regulatorUrl: 'https://www.odc.gov.au/medicinal-cannabis/importing-medicinal-cannabis-products-australia',
    lastVerified: '2026-08-05',
    transitDays: '1–2 days air ex-BKK to SYD/MEL',
    permits: [
      'Thai ภ.ท.10 export licence plus ภ.ท.32 per-shipment notification',
      'ODC medicinal cannabis import licence (annual, up to 12 months)',
      'ODC import permit for each shipment and substance/preparation type',
      'TGO 93 conformity — s.13(3) GMP evidence or TGA inspection for non-listed manufacturing countries',
    ],
    qualityGate:
      'The realistic Thai route is starting material into a TGA-licensed manufacturer, using TGO 93 carve-outs for cultivation and first crude extraction without site GMP. Finished flower direct to pharmacy is not the typical path.',
    honestNote:
      'Australia imported 77,406 kg in 2024 (ODC annual data, cited via trade press). Importers should confirm ODC import forecasts — ODC adjusted 2026 forecasts for many licence holders in 2026.',
    faqs: [
      {
        question: 'Can we ship finished cannabis flower to Australian pharmacies?',
        answer:
          'Usually no. Most Thai exports enter as starting material for further manufacture at a TGA-licensed site with valid GMP evidence. Route assessment requires the importer’s ODC permits and quality dossier.',
      },
    ],
  },
  {
    slug: 'south-africa',
    country: 'South Africa',
    gateway: 'Johannesburg (JNB)',
    region: 'Africa',
    title: 'Export cannabis from Thailand to South Africa',
    metaTitle: 'Thailand to South Africa Cannabis Export',
    metaDescription:
      'Bangkok to Johannesburg air freight — SAHPRA section 22C licence, section 22A permit, GMP/GWP site evidence, and validated cold chain from OMG Experience.',
    regulator: 'SAHPRA',
    regulatorUrl: 'https://www.sahpra.org.za/cannabis-and-related-substances/',
    lastVerified: '2026-08-05',
    transitDays: '2–3 days air ex-BKK to JNB',
    permits: [
      'Thai ภ.ท.10 export licence plus ภ.ท.32 per-shipment notification',
      'SAHPRA section 22C(1)(b) licence covering import (and related activities as needed)',
      'Section 22A(9)(a)(i) permit from the Director-General of Health for Schedule 7 substances',
    ],
    qualityGate:
      'SAHPRA requires documentary proof of GMP and Good Wholesaling Practice; a site inspection may be required. Annexure 7 and PIC/S GMP Part II apply to plant-derived starting materials. SAHPRA may audit overseas growing and manufacturing operations.',
    faqs: [
      {
        question: 'Does South Africa cap cannabis import volumes?',
        answer:
          'SAHPRA states there is no cap on licence numbers, but total quantities produced in South Africa may not exceed the INCB quota. Importers should confirm their quota position with SAHPRA.',
      },
    ],
  },
  {
    slug: 'new-zealand',
    country: 'New Zealand',
    gateway: 'Auckland (AKL)',
    region: 'Oceania',
    title: 'Export cannabis from Thailand to New Zealand',
    metaTitle: 'Thailand to New Zealand Cannabis Export',
    metaDescription:
      'Bangkok to Auckland air freight — Medsafe medicinal cannabis licence, per-consignment import licence (NZ$194.22), minimum quality standard, and GDP cold chain.',
    regulator: 'Medsafe / Medicinal Cannabis Agency',
    regulatorUrl:
      'https://www.health.govt.nz/regulation-legislation/medicinal-cannabis/information-for-industry/working-with-medicinal-cannabis/importing-and-exporting',
    lastVerified: '2026-08-05',
    transitDays: '2–3 days air ex-BKK to AKL',
    permits: [
      'Thai ภ.ท.10 export licence plus ภ.ท.32 per-shipment notification',
      'Medicinal cannabis licence with supply activity',
      'Controlled drug import licence per consignment (up to 4 products; ~30 working days processing)',
      'Medicinal Cannabis Agency product assessment against the minimum quality standard',
    ],
    qualityGate:
      'Manufacture must meet the New Zealand Code of GMP, or certification from a Medsafe-recognised authority. Live cannabis plants cannot be imported until MPI publishes a plant import health standard.',
    honestNote:
      'Initial extracts destined for further processing may be classified as starting material and may not need to meet the full minimum quality standard — confirm with the importer’s consultant.',
    faqs: [
      {
        question: 'How long does the New Zealand import licence take?',
        answer:
          'Medicines Control targets up to 30 working days per consignment import licence. Planning should include both OMG air transit and importer permit lead time.',
      },
    ],
  },
  {
    slug: 'portugal',
    country: 'Portugal',
    gateway: 'Lisbon (LIS)',
    region: 'Europe',
    title: 'Export cannabis from Thailand to Portugal',
    metaTitle: 'Thailand to Portugal Cannabis Export',
    metaDescription:
      'Bangkok to Lisbon air freight — Infarmed import authorisation, third-country supplier qualification with CAPA audit, and EU-GMP processing hub routing from OMG Experience.',
    regulator: 'Infarmed',
    regulatorUrl: 'https://www.infarmed.pt/web/infarmed/canabis-medicinal',
    lastVerified: '2026-08-05',
    transitDays: '2–4 days air ex-BKK to LIS',
    permits: [
      'Thai ภ.ท.10 export licence plus ภ.ท.32 per-shipment notification',
      'Infarmed certificate of prior authorisation (Certificado de Importação) per operation',
      'Importer-conducted supplier audit report including CAPA assessment',
      'Written confirmation from Thailand’s competent authority on GACP equivalence, or evidence the authority does not issue one',
    ],
    qualityGate:
      'Portugal supplied 10,342 kg to Germany in Q1 2026 (BfArM data via trade press) — often as an EU-GMP processing hub rather than final patient market. Thai GACP alone does not satisfy Infarmed’s third-country dossier.',
    faqs: [
      {
        question: 'Will DTAM issue the “written confirmation” Infarmed requires?',
        answer:
          'This is the critical gate. Confirm with DTAM whether they will issue a competent-authority confirmation for the specific producer before promising Portuguese routing.',
      },
    ],
  },
  {
    slug: 'czech-republic',
    country: 'Czech Republic',
    gateway: 'Prague (PRG)',
    region: 'Europe',
    title: 'Export cannabis from Thailand to Czech Republic',
    metaTitle: 'Thailand to Czech Republic Cannabis Export',
    metaDescription:
      'Bangkok to Prague air freight — distribution authorisation, Ministry of Health addictive-substance permits, and EU importer documentation from OMG Experience.',
    regulator: 'SÚKL · Ministry of Health',
    regulatorUrl:
      'https://sukl.gov.cz/en/pharmaceutical-industry/cannabis-for-medicinal-purposes/distributors-and-importers/distribution-and-import/',
    lastVerified: '2026-08-05',
    transitDays: '2–4 days air ex-BKK to PRG',
    permits: [
      'Thai ภ.ท.10 export licence plus ภ.ท.32 per-shipment notification',
      'Distribution authorisation for medicinal products (SÚKL guidance DIS-8)',
      'Ministry of Health permit to handle addictive substances (Form 1)',
      'Ministry of Health import permit (Form 14) with import estimate (Form 41)',
    ],
    qualityGate:
      'Import distribution from abroad is not within SÚKL’s statutory remit — the Ministry of Health issues substantive import permits. GDP obligations apply to distributors.',
    faqs: [
      {
        question: 'Who is the import licensor for Czechia?',
        answer:
          'The Ministry of Health, not SÚKL. SÚKL publishes the requirements; the importer must hold both distribution and narcotic-handling authorisations.',
      },
    ],
  },
  {
    slug: 'north-macedonia',
    country: 'North Macedonia',
    gateway: 'Skopje (SKP)',
    region: 'Europe',
    title: 'Bangkok air freight to North Macedonia',
    metaTitle: 'Bangkok to Skopje Air Freight Lane',
    metaDescription:
      'Scheduled Bangkok to Skopje air freight from OMG Experience. Medical cannabis flower export into North Macedonia requires buyer-side verification — sector is export-oriented.',
    regulator: 'MALMED (Agency for Medicines)',
    regulatorUrl: 'https://malmed.gov.mk/',
    lastVerified: '2026-08-05',
    transitDays: '2–4 days air ex-BKK to SKP',
    permits: [
      'Thai ภ.ท.10 export licence plus ภ.ท.32 where product classification permits export',
      'MALMED import/export permit via EXIM single-window for medicines (I040/E040) where applicable',
    ],
    qualityGate:
      'North Macedonia is primarily a medical cannabis production and export hub; flower export from the country is restricted. Treat Skopje as a general air-freight lane unless your consignee confirms a valid medical import pathway.',
    honestNote:
      'We could not verify cannabis-specific import rules on MALMED’s site as of August 2026. Verify your Skopje consignee and product category before booking.',
    faqs: [
      {
        question: 'Is North Macedonia a buyer market for Thai cannabis flower?',
        answer:
          'Unlikely for raw flower. Confirm consignee licences and product form before quoting. OMG publishes the lane for operational air capacity; regulatory fit is buyer-specific.',
      },
    ],
  },
];

export function laneBySlug(slug: string): ExportLane | undefined {
  return exportLanes.find((l) => l.slug === slug);
}
