"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { Check } from "lucide-react";
import { BookDemoButton } from "@/components/DemoModal";

const POINTS = [
  "Pay only on LTV we recover or expand",
  "Every saved customer turns loss into income",
  "No recovery means no charge, ever",
];

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 bg-[#09090b] px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-6xl text-center">
        <ScrollReveal>
          <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold leading-tight tracking-[-0.025em] text-white sm:text-5xl">
            You only pay
            <br />
            <span className="text-zinc-300">on LTV we deliver.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-zinc-300">
            No subscription. No seat fees. We convert churn into recovered revenue, and you pay only on results.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-10 grid max-w-4xl gap-3 text-left sm:grid-cols-3">
          {POINTS.map((point, i) => (
            <ScrollReveal key={point} delay={0.12 + i * 0.1}>
              <div className="flex h-full items-start gap-3 rounded-xl border border-white/12 bg-white/[0.05] p-4">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-assis-blue">
                  <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                </div>
                <p className="text-sm font-medium leading-snug text-zinc-200">{point}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4} className="mt-8">
          <BookDemoButton className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#09090b] shadow-[0_8px_28px_-6px_rgba(255,255,255,0.15)] transition-all hover:-translate-y-0.5">
            Talk to us about pricing
          </BookDemoButton>
        </ScrollReveal>
      </div>
    </section>
  );
}
