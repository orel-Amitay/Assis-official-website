"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BookDemoButton } from "@/components/DemoModal";
import { useScrollRoot } from "@/components/ScrollRoot";
import { NAV_LINKS } from "@/data/base44";
import { scrollToSection } from "./scrollToSection";

export default function Nav() {
  const scrollRoot = useScrollRoot();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const el = scrollRoot?.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 20);
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

  function handleNavClick(id: string) {
    setMobileOpen(false);
    scrollToSection(id);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-white/70 py-3 shadow-sm backdrop-blur-sm"
          : "bg-transparent py-5"
      }`}
      style={{ paddingTop: "max(0px, env(safe-area-inset-top))" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => scrollToSection("top")}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image
            src="/base44/af6b42f42_Assis-HeartLogo.png"
            alt="Assis"
            width={28}
            height={28}
            unoptimized
            className="h-7 w-7"
          />
          <span className="font-headline text-lg font-bold text-[hsl(var(--on-surface))]">
            Assis
          </span>
        </button>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="text-sm font-medium text-[hsl(var(--on-surface-variant))] transition-colors hover:text-[hsl(var(--primary))]"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <BookDemoButton className="hidden h-10 items-center justify-center rounded-full bg-[hsl(var(--primary))] px-5 text-sm font-semibold text-white shadow-[0_4px_16px_-4px_hsl(var(--primary)/0.45)] transition hover:opacity-90 sm:inline-flex">
            Book a Demo
          </BookDemoButton>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[hsl(var(--on-surface))] transition-colors hover:bg-white/60 lg:hidden"
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
            className="overflow-hidden border-t border-white/40 bg-white/95 backdrop-blur-md lg:hidden"
          >
            <nav className="flex max-h-[min(70vh,28rem)] flex-col gap-1 overflow-y-auto px-5 py-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="rounded-lg px-3 py-3.5 text-left text-[15px] font-medium text-[hsl(var(--on-surface))] hover:bg-[hsl(var(--surface-container-low))]"
                >
                  {link.label}
                </button>
              ))}
              <BookDemoButton
                onClick={() => setMobileOpen(false)}
                className="mt-2 w-full rounded-full bg-[hsl(var(--primary))] px-5 py-3.5 text-sm font-semibold text-white"
              >
                Book a Demo
              </BookDemoButton>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
