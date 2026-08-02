"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const FAQS = [
  {
    q: "Is Assis software?",
    a: "No. Assis combines AI, people, and operational expertise into one customer relationship platform.",
  },
  {
    q: "Can I start with AI only?",
    a: "Absolutely. Most brands begin with Powered and expand as they grow.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. Your customer history, workflows, and knowledge stay with you.",
  },
  {
    q: "How long does onboarding take?",
    a: "Most brands go live within a few days.",
  },
] as const;

export default function BrandFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-assis-blue">
            FAQ
          </p>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            Questions worth answering.
          </h2>
        </ScrollReveal>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <ScrollReveal key={item.q} delay={0.04 * i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-start justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-lg font-semibold tracking-[-0.02em]">
                    {item.q}
                  </span>
                  <Plus
                    className={`mt-1 h-5 w-5 shrink-0 transition ${
                      isOpen ? "rotate-45 text-assis-blue" : "text-muted-foreground"
                    }`}
                    strokeWidth={1.75}
                  />
                </button>
                {isOpen ? (
                  <p className="pb-5 pr-10 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.a}
                  </p>
                ) : null}
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
