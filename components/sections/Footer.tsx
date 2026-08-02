"use client";

import ScrollReveal from "@/components/ScrollReveal";
import AssisLogo from "@/components/AssisLogo";
import { BookDemoButton } from "@/components/DemoModal";

const PRODUCT_LINKS = [
  { label: "Numbers", href: "#metrics" },
  { label: "Store stories", href: "#cases" },
  { label: "How it works", href: "#journey" },
  { label: "Why Assis", href: "#position" },
  { label: "FAQ", href: "#faq" },
  { label: "Start", href: "#demo" },
];

const linkClassName = "text-sm text-zinc-500 transition-colors hover:text-foreground";

export default function Footer() {
  return (
    <footer className="overflow-hidden px-5 pt-8 pb-[max(5rem,calc(env(safe-area-inset-bottom)+4.5rem))] sm:px-10 sm:pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 border-t border-assis-blue/10 pb-12 pt-14 sm:grid-cols-2 lg:grid-cols-3">
          <ScrollReveal delay={0.05}>
            <a href="#top" className="mb-5 inline-block transition-opacity hover:opacity-80">
              <AssisLogo height={18} />
            </a>
            <p className="max-w-[260px] text-sm leading-relaxed text-zinc-500">
              Customer care that runs with your ecommerce store, so shoppers feel
              looked after and your numbers follow.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
              Product
            </h4>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClassName}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
              Get started
            </h4>
            <BookDemoButton className="rounded-full bg-assis-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-assis-blue-deep">
              Book a demo
            </BookDemoButton>
          </ScrollReveal>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-assis-blue/10 py-6 text-xs text-zinc-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Assis. All rights reserved.</p>
          <a href="/privacy-policy" className="transition-colors hover:text-foreground">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
