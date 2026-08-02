"use client";

import ScrollReveal from "@/components/ScrollReveal";
import PositionLink from "@/components/PositionLink";

const PHASES = [
  {
    label: "Before",
    items: ["Questions", "Hesitation", "Trust"],
    result: "Move forward",
  },
  {
    label: "After",
    items: ["Orders", "Returns", "Refunds"],
    result: "Protect",
  },
  {
    label: "Behind",
    items: ["Patterns", "Gaps", "Opportunity"],
    result: "Show the business",
  },
];

export default function WhatAssisDoes() {
  return (
    <section id="how" className="scroll-mt-20 bg-zinc-50 px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="font-display text-center text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-5xl">
            The entire customer relationship.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mt-8 flex justify-center">
          <PositionLink />
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5">
          {PHASES.map((phase, i) => (
            <ScrollReveal key={phase.label} delay={0.1 + i * 0.08}>
              <div className="h-full rounded-2xl bg-white px-5 py-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-assis-blue">
                  {phase.label}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {phase.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-zinc-50 px-3 py-1 text-sm text-foreground/65"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="mt-5 font-display text-base font-bold text-foreground">
                  {phase.result}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
