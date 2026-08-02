"use client";

import ScrollReveal from "@/components/ScrollReveal";

const STATS = [
  { value: "₪265K", label: "Net impact / month" },
  { value: "4,827%", label: "ROI" },
  { value: "293", label: "Relationships managed" },
];

export default function ShowTheMoney() {
  return (
    <section id="money" className="scroll-mt-20 bg-[#09090b] px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="font-display text-center text-3xl font-bold tracking-[-0.035em] text-white sm:text-5xl">
            Customer relationships have a P&amp;L.
          </h2>
        </ScrollReveal>

        <div className="mx-auto mt-14 grid max-w-4xl gap-10 sm:mt-16 sm:grid-cols-3 sm:gap-6">
          {STATS.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={0.1 + i * 0.08} className="text-center">
              <p className="font-display text-5xl font-bold tracking-tight text-assis-blue-soft sm:text-6xl">
                {stat.value}
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                {stat.label}
              </p>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.35} className="mt-14 text-center sm:mt-16">
          <p className="font-display text-lg font-bold text-zinc-400 sm:text-2xl">
            We managed the relationship differently.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
