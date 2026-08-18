"use client";

import ScrollReveal from "@/components/ScrollReveal";

const PILLARS = [
  {
    title: "We automate.",
    line: "So customers never wait.",
    proof: "93% resolved automatically",
    image: "/brand/assis-heart-classic.png",
    imageClass: "h-9 w-9",
  },
  {
    title: "We operate.",
    line: "So your team can focus on the business.",
    proof: "4.9 Google rating",
    image: "/brand/roomi-logo.png",
    imageClass: "h-8 w-auto max-w-[120px]",
  },
  {
    title: "We optimize.",
    line: "So every conversation creates value.",
    proof: "43% conversion improvement",
    image: "/brand/sharp-logo.png",
    imageClass: "h-5 w-auto max-w-[120px]",
  },
] as const;

export default function WhyAssisSection() {
  return (
    <section id="why" className="px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-assis-blue">
            Why Assis?
          </p>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
            Customer support solves tickets.
            <span className="mt-2 block text-assis-blue">
              Assis builds customer relationships.
            </span>
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <ScrollReveal key={pillar.title} delay={0.1 * i}>
              <div className="h-full rounded-3xl border border-border bg-white/80 p-6 sm:p-7">
                <div className="mb-5 flex h-12 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pillar.image}
                    alt=""
                    className={`object-contain opacity-80 ${pillar.imageClass}`}
                  />
                </div>
                <p className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
                  {pillar.title}
                </p>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {pillar.line}
                </p>
                <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-assis-blue">
                  {pillar.proof}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
