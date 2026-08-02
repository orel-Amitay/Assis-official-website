"use client";

import { useState } from "react";
import Link from "next/link";

const shop = [
  { label: "Bracelets", href: "/collections/bracelets" },
  { label: "Necklaces", href: "/collections/necklaces" },
  { label: "Shop All", href: "/collections/shop-all" },
];

const profile = [
  { label: "My Account", href: "/account/login" },
  { label: "My Orders", href: "/account/login" },
  { label: "Your Privacy Choices", href: "/pages/data-sharing-opt-out" },
];

const support = [
  { label: "Customer Service", href: "/pages/customer-service" },
  { label: "Returns & Exchanges", href: "/pages/return-policy" },
  { label: "Privacy Policy", href: "/policies/privacy-policy" },
  { label: "Refund Policy", href: "/policies/refund-policy" },
  { label: "Terms of Service", href: "/policies/terms-of-service" },
  { label: "Contact", href: "/pages/contact" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-10 lg:py-16">
        <div>
          <h3 className="font-display text-sm tracking-[0.22em]">INSIDE TENNIS CLUB</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Updates on new arrivals, gem education, and the pieces we&apos;re wearing.
          </p>
          <form
            className="mt-5 flex max-w-md border border-border"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.trim()) return;
              setDone(true);
              setEmail("");
            }}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              className="bg-foreground px-5 text-[11px] font-semibold tracking-[0.16em] text-white transition hover:bg-sage"
            >
              Subscribe
            </button>
          </form>
          {done ? (
            <p className="mt-2 text-xs text-sage">Thanks — you&apos;re on the list.</p>
          ) : null}
        </div>

        <FooterCol title="SHOP" links={shop} />
        <FooterCol title="PROFILE" links={profile} />
        <FooterCol title="SUPPORT" links={support} />
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-6 text-[11px] tracking-[0.08em] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p>© {new Date().getFullYear()} TENNIS CLUB — All Rights Reserved</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/policies/privacy-policy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/policies/terms-of-service" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/policies/contact-information" className="hover:text-foreground">
              Contact info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold tracking-[0.2em]">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-muted transition hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
