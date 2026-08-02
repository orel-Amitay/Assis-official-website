"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import AssisLogo from "@/components/AssisLogo";
import { useScrollRoot } from "@/components/ScrollRoot";
import { BookDemoButton } from "@/components/DemoModal";

const NAV_LINKS = [
  { label: "Numbers", href: "#metrics" },
  { label: "Store stories", href: "#cases" },
  { label: "How it works", href: "#journey" },
  { label: "Why Assis", href: "#position" },
  { label: "FAQ", href: "#faq" },
  { label: "Start", href: "#demo" },
];

export default function Nav() {
  const scrollRoot = useScrollRoot();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const el = scrollRoot?.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 8);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRoot]);

  useEffect(() => {
    const el = scrollRoot?.current;
    if (!el) return;
    el.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      el.style.overflow = "";
    };
  }, [mobileOpen, scrollRoot]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white/90 transition-shadow duration-300 backdrop-blur-md ${
        scrolled || mobileOpen ? "border-b border-border shadow-sm" : ""
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-10">
        <a href="#top" className="shrink-0 transition-opacity hover:opacity-80">
          <AssisLogo height={18} />
        </a>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href="https://onboarding.assis.care/login"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Log in
          </a>
          <BookDemoButton className="hidden h-9 items-center justify-center rounded-full bg-assis-blue px-4 text-sm font-semibold text-white transition-colors hover:bg-assis-blue-deep sm:inline-flex">
            Book a demo
          </BookDemoButton>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-zinc-100 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border bg-white lg:hidden"
          >
            <nav className="flex max-h-[min(70vh,28rem)] flex-col gap-1 overflow-y-auto px-5 py-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3.5 text-[15px] font-medium text-foreground hover:bg-zinc-50"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://onboarding.assis.care/login"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3.5 text-[15px] font-medium text-muted-foreground hover:bg-zinc-50 hover:text-foreground"
              >
                Log in
              </a>
              <BookDemoButton
                onClick={() => setMobileOpen(false)}
                className="mt-2 w-full rounded-full bg-assis-blue px-5 py-3.5 text-sm font-semibold text-white"
              >
                Book a demo
              </BookDemoButton>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
