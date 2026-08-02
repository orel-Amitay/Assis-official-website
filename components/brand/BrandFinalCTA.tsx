"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { BookDemoButton } from "@/components/DemoModal";

export default function BrandFinalCTA() {
  return (
    <section id="demo" className="px-5 py-20 sm:px-10 sm:py-28">
      <ScrollReveal>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-[#0b1220] px-6 py-16 text-center text-white sm:px-12 sm:py-20">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(29,111,238,0.35), transparent 65%)",
            }}
          />
          <div className="relative">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8eb7ff]">
              Powered. Trusted. Grow.
            </p>
            <h2 className="font-display mt-5 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
              Customer relationships shouldn&apos;t be another thing to manage.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/70 sm:text-lg">
              Let Assis handle them.
            </p>
            <BookDemoButton className="mt-9 inline-flex h-12 items-center justify-center rounded-full bg-assis-blue px-8 text-sm font-semibold text-white transition hover:bg-assis-blue-soft">
              Book a demo
            </BookDemoButton>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
