"use client";

import Link from "next/link";
import AssisLogo from "@/components/AssisLogo";
import { BookDemoButton } from "@/components/DemoModal";
import { LEGAL_DOCS } from "@/lib/legal";
import {
  CONTACT_MAIL,
  LINKEDIN_URL,
  LOGIN_URL,
  SHOPIFY_APP_URL,
} from "@/lib/site-nav";

const PRODUCT_LINKS = [
  { label: "How it works", href: "/#journey" },
  { label: "Intelligence", href: "/#intelligence" },
  { label: "Packages", href: "/#ways" },
  { label: "Powered by Assis", href: "/PoweredByAssis" },
  { label: "Platforms", href: "/#install" },
  {
    label: "Download Shopify App",
    href: SHOPIFY_APP_URL,
    external: true,
    highlight: true,
  },
] as const;

const EXPLORE_LINKS = [
  { label: "Proof", href: "/#cases" },
  { label: "Why Assis", href: "/#position" },
  { label: "FAQ", href: "/#faq" },
  { label: "Book a demo", href: "/#demo" },
] as const;

function FooterLink({
  href,
  children,
  external,
  highlight,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  highlight?: boolean;
}) {
  const className = highlight
    ? "text-sm font-semibold text-assis-blue transition hover:text-assis-blue-soft"
    : "text-sm text-white/85 transition hover:text-white";

  if (external) {
    return (
      <a
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        className={className}
      >
        {children}
      </a>
    );
  }

  if (href.startsWith("/") && !href.startsWith("/#")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="mt-6 overflow-hidden rounded-t-[2rem] bg-[#12141a] text-white sm:mt-10 sm:rounded-t-[2.5rem]">
      <div className="mx-auto max-w-6xl px-5 pb-[max(5rem,calc(env(safe-area-inset-bottom)+4.5rem))] pt-14 sm:px-10 sm:pb-10 sm:pt-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="max-w-xs lg:col-span-4">
            <a href="/" className="inline-block transition-opacity hover:opacity-80">
              <AssisLogo height={20} variant="on-dark" />
            </a>
            <p className="mt-5 text-sm leading-relaxed text-white/55">
              The operating layer between your business and your customers.
            </p>
            <address className="mt-5 not-italic text-xs leading-relaxed text-white/40">
              28 Geary St STE 650, 585
              <br />
              San Francisco, CA 94108
              <br />
              United States
            </address>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
              Product
            </p>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink
                    href={link.href}
                    external={"external" in link ? Boolean(link.external) : false}
                    highlight={"highlight" in link ? Boolean(link.highlight) : false}
                  >
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
              Explore
            </p>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
              Company
            </p>
            <ul className="space-y-3">
              <li>
                <FooterLink href={CONTACT_MAIL} external>
                  Contact
                </FooterLink>
              </li>
              <li>
                <FooterLink href={LOGIN_URL} external>
                  Business Login
                </FooterLink>
              </li>
              <li>
                <BookDemoButton className="text-left text-sm text-white/85 transition hover:text-white">
                  Book a demo
                </BookDemoButton>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
              Legal
            </p>
            <ul className="space-y-3">
              {LEGAL_DOCS.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={doc.href}
                    className="text-sm text-white/85 transition hover:text-white"
                  >
                    {doc.shortLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Assis Online Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/PrivacyPolicy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/BusinessTerms" className="transition hover:text-white">
              Business Terms
            </Link>
            <Link href="/CookiePolicy" className="transition hover:text-white">
              Cookie Policy
            </Link>
            <a href={CONTACT_MAIL} className="transition hover:text-white">
              Contact Us
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Assis on LinkedIn"
              className="inline-flex h-7 w-7 items-center justify-center rounded bg-white/10 text-white transition hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.5c0-1.55-.03-3.55-2.16-3.55-2.16 0-2.49 1.69-2.49 3.44V23h-4V8.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
