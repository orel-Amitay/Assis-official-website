export const LEGAL_LAST_UPDATED = "August 1, 2026";

export type LegalSlug =
  | "PrivacyPolicy"
  | "BusinessTerms"
  | "EndUserTerms"
  | "WebsiteTerms"
  | "CookiePolicy"
  | "DataProcessingAgreement";

export type LegalDoc = {
  slug: LegalSlug;
  href: string;
  title: string;
  shortLabel: string;
  description: string;
};

export const LEGAL_DOCS: readonly LegalDoc[] = [
  {
    slug: "PrivacyPolicy",
    href: "/PrivacyPolicy",
    title: "Privacy Policy",
    shortLabel: "Privacy Policy",
    description:
      "How Assis Online Inc. collects, uses, shares, protects, and retains personal information across the Assis platform, channels, and AI systems.",
  },
  {
    slug: "BusinessTerms",
    href: "/BusinessTerms",
    title: "Business Terms of Service",
    shortLabel: "Business Terms",
    description:
      "The terms that govern use of Assis services by businesses, including plans, channels, proactive communications, fees, and liability.",
  },
  {
    slug: "EndUserTerms",
    href: "/EndUserTerms",
    title: "End User Terms of Use",
    shortLabel: "End User Terms",
    description:
      "The terms that apply when you interact with a business through a customer care service powered or operated by Assis.",
  },
  {
    slug: "WebsiteTerms",
    href: "/WebsiteTerms",
    title: "Website Terms",
    shortLabel: "Website Terms",
    description:
      "The terms that govern access to and use of the Assis marketing website at https://assis.care and related Assis web pages.",
  },
  {
    slug: "CookiePolicy",
    href: "/CookiePolicy",
    title: "Cookie Policy",
    shortLabel: "Cookie Policy",
    description:
      "How Assis uses cookies and similar technologies on https://assis.care, and how you can manage your cookie preferences.",
  },
  {
    slug: "DataProcessingAgreement",
    href: "/DataProcessingAgreement",
    title: "Data Processing Agreement",
    shortLabel: "Data Processing Agreement",
    description:
      "The DPA that applies when Assis processes Customer Personal Data on behalf of a business, including roles, subprocessors, and transfers.",
  },
] as const;

export function legalDoc(slug: LegalSlug): LegalDoc {
  const doc = LEGAL_DOCS.find((entry) => entry.slug === slug);
  if (!doc) throw new Error(`Unknown legal document: ${slug}`);
  return doc;
}
