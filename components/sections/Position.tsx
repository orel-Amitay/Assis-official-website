"use client";

import ScrollReveal from "@/components/ScrollReveal";
import PositionLink from "@/components/PositionLink";

const BUSINESS = ["Inventory", "Fulfillment", "Marketing", "Margins", "Ops"];
const CUSTOMER = ["Order", "Money", "Frustration", "Expectations", "Trust"];

export default function Position() {
  return (
    <section id="position" className="scroll-mt-20 bg-white px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
          <ScrollReveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Inside the business
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {BUSINESS.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-zinc-50 px-4 py-2 text-sm font-medium text-foreground/70"
                >
                  {item}
                </span>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-assis-blue">
              Inside the problem
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {CUSTOMER.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-assis-blue/20 bg-assis-blue-light px-4 py-2 text-sm font-medium text-assis-blue-deep"
                >
                  {item}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.14} className="mt-16 flex flex-col items-center sm:mt-20">
          <PositionLink size="lg" className="justify-center" />
          <p className="font-display mt-10 text-center text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-5xl">
            We stand between both.
          </p>
          <p className="font-display mt-6 text-center text-xl font-bold tracking-[-0.03em] text-assis-blue sm:text-3xl">
            Change the position. Change everything.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
