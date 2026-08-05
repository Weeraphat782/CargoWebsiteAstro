import {
  absoluteUrl,
  BRAND_NAME,
  BRAND_LEGAL_NAME,
  CONTACT_EMAIL,
  CONTACT_LOCALITY,
  CONTACT_PHONE_E164,
  CONTACT_POSTAL_CODE,
  CONTACT_REGION,
  CONTACT_STREET,
  DEFAULT_AUTHOR_NAME,
  getSiteUrl,
} from "@/lib/site";
import { serviceAreaCountries } from "@/data/marketing-destinations";

type JsonLdGraph = Record<string, unknown>;

function editorialAuthorPerson(): JsonLdGraph {
  return {
    "@type": "Person",
    name: DEFAULT_AUTHOR_NAME,
    url: absoluteUrl("/about"),
    worksFor: { "@id": `${getSiteUrl()}/#organization` },
  };
}

/**
 * Parse markdown for `## FAQ` / `## Frequently Asked Questions` then `###` Q + body until next `###`.
 */
export function extractFaqsFromMarkdown(markdown: string): {
  question: string;
  answer: string;
}[] {
  if (!markdown?.trim()) return [];
  const lines = markdown.split(/\r?\n/);
  let inFaq = false;
  const faqs: { question: string; answer: string }[] = [];
  let currentQ: string | null = null;
  let currentA: string[] = [];

  const flush = () => {
    if (currentQ && currentA.length) {
      const answer = currentA.join("\n").trim();
      if (answer) faqs.push({ question: currentQ, answer });
    }
    currentQ = null;
    currentA = [];
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/);
    if (h2) {
      const title = h2[1].trim().toLowerCase();
      const isFaq =
        title.includes("faq") || title.includes("frequently asked");
      if (isFaq) {
        flush();
        inFaq = true;
        continue;
      }
      if (inFaq) {
        flush();
        inFaq = false;
      }
      continue;
    }
    if (!inFaq) continue;

    const h3 = line.match(/^###\s+(.+)/);
    if (h3) {
      flush();
      currentQ = h3[1].trim();
      currentA = [];
      continue;
    }
    if (currentQ) {
      currentA.push(line);
    }
  }
  if (inFaq) flush();
  return faqs;
}

export function faqPageSchema(
  faqs: { question: string; answer: string }[],
): JsonLdGraph | null {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function jsonLdScript(graph: JsonLdGraph | JsonLdGraph[]) {
  const data = Array.isArray(graph)
    ? { "@context": "https://schema.org", "@graph": graph }
    : graph;
  return JSON.stringify(data);
}

/** Merge site + page + breadcrumb blocks into one @graph script (OC-17). */
export function mergeJsonLdScripts(...rawBlocks: (string | undefined)[]): string {
  const nodes: JsonLdGraph[] = [];
  for (const raw of rawBlocks) {
    if (!raw?.trim()) continue;
    const parsed = JSON.parse(raw) as JsonLdGraph & { "@graph"?: JsonLdGraph[] };
    if (Array.isArray(parsed["@graph"])) {
      nodes.push(...parsed["@graph"]);
    } else {
      const { "@context": _c, ...rest } = parsed;
      nodes.push(rest);
    }
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}

export function organizationSchema(): JsonLdGraph {
  return {
    "@type": "Organization",
    "@id": `${getSiteUrl()}/#organization`,
    name: BRAND_NAME,
    legalName: BRAND_LEGAL_NAME,
    url: getSiteUrl(),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
    },
    description:
      "Bangkok air freight forwarder for licensed cannabis, hemp, and kratom exports — customs, partner GDP warehousing, partner ISO lab testing, and AI document intelligence.",
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_E164,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT_STREET,
      addressLocality: CONTACT_LOCALITY,
      addressRegion: CONTACT_REGION,
      postalCode: CONTACT_POSTAL_CODE,
      addressCountry: "TH",
    },
    areaServed: serviceAreaCountries(),
    sameAs: [
      "https://www.linkedin.com/company/omgexp",
      "https://x.com/omgexp",
      "https://www.instagram.com/omgexperience/",
    ],
  };
}

export function localBusinessSchema(): JsonLdGraph {
  return {
    "@type": "LocalBusiness",
    "@id": `${getSiteUrl()}/#localbusiness`,
    name: BRAND_NAME,
    legalName: BRAND_LEGAL_NAME,
    url: getSiteUrl(),
    email: CONTACT_EMAIL,
    telephone: CONTACT_PHONE_E164,
    image: absoluteUrl("/logo.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT_STREET,
      addressLocality: CONTACT_LOCALITY,
      addressRegion: CONTACT_REGION,
      postalCode: CONTACT_POSTAL_CODE,
      addressCountry: "TH",
    },
    parentOrganization: { "@id": `${getSiteUrl()}/#organization` },
    areaServed: serviceAreaCountries(),
    sameAs: [
      "https://www.linkedin.com/company/omgexp",
      "https://x.com/omgexp",
      "https://www.instagram.com/omgexperience/",
    ],
  };
}

export function websiteSchema(): JsonLdGraph {
  return {
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    name: BRAND_NAME,
    url: getSiteUrl(),
    publisher: { "@id": `${getSiteUrl()}/#organization` },
    inLanguage: "en-US",
  };
}

export function breadcrumbListSchema(
  items: { name: string; path: string }[],
): JsonLdGraph {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function blogPostingSchema(input: {
  headline: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string | null;
  wordCount?: number;
}): JsonLdGraph {
  const url = absoluteUrl(`/newsroom/${input.slug}`);
  return {
    "@type": "BlogPosting",
    headline: input.headline,
    description: input.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: editorialAuthorPerson(),
    publisher: { "@id": `${getSiteUrl()}/#organization` },
    inLanguage: "en-US",
    ...(input.imageUrl
      ? {
          image: {
            "@type": "ImageObject",
            url: input.imageUrl,
          },
        }
      : {}),
    ...(input.wordCount != null ? { wordCount: input.wordCount } : {}),
  };
}

export function articleSchema(input: {
  headline: string;
  description: string;
  slug: string;
  datePublished?: string;
  dateModified?: string;
  imageUrl?: string | null;
}): JsonLdGraph {
  const url = absoluteUrl(`/resources/${input.slug}`);
  return {
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(input.datePublished
      ? { datePublished: input.datePublished }
      : {}),
    ...(input.dateModified
      ? { dateModified: input.dateModified }
      : {}),
    author: editorialAuthorPerson(),
    publisher: { "@id": `${getSiteUrl()}/#organization` },
    inLanguage: "en-US",
    ...(input.imageUrl
      ? {
          image: {
            "@type": "ImageObject",
            url: input.imageUrl,
          },
        }
      : {}),
  };
}

export function webPageSchema(input: {
  path: string;
  name: string;
  description: string;
}): JsonLdGraph {
  const url = absoluteUrl(input.path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { "@id": `${getSiteUrl()}/#website` },
    inLanguage: "en-US",
  };
}

export function itemListSchema(
  name: string,
  items: { name: string; url: string }[],
): JsonLdGraph {
  return {
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function serviceSchemas(
  services: { id: string; title: string; shortDescription: string }[],
): JsonLdGraph[] {
  return services.map((s) => ({
    "@type": "Service",
    "@id": `${getSiteUrl()}/services#${s.id}`,
    name: s.title,
    description: s.shortDescription,
    provider: { "@id": `${getSiteUrl()}/#organization` },
    areaServed: serviceAreaCountries(),
    url: absoluteUrl(`/services/${s.id}`),
  }));
}
