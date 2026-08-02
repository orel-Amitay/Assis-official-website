"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const BEFORE = [
  "Will this arrive on time?",
  "Can I trust this brand?",
  "What if it doesn't fit?",
];

const AFTER = [
  "Where is my order?",
  "I want a refund.",
  "I'm never buying here again.",
];

export default function EcommerceReality() {
  return (
    <section id="reality" className="scroll-mt-20 bg-zinc-50 px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="font-display mx-auto max-w-2xl text-center text-3xl font-bold leading-[1.1] tracking-[-0.035em] text-foreground sm:text-5xl">
            Every order has a relationship around it.
          </h2>
        </ScrollReveal>

        <div className="relative mx-auto mt-14 max-w-3xl sm:mt-16">
          {/* Floating chips around center */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
            <div className="flex flex-col items-end gap-2.5">
              {BEFORE.map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="max-w-[9.5rem] rounded-2xl bg-white px-3 py-2 text-right text-[11px] leading-snug text-foreground/70 shadow-sm sm:max-w-[14rem] sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  &ldquo;{line}&rdquo;
                </motion.span>
              ))}
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-assis-blue/60">
                Before
              </p>
            </div>

            <ScrollReveal>
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-assis-blue/25 bg-white shadow-[0_8px_32px_-12px_rgba(29,111,238,0.35)] sm:h-28 sm:w-28">
                <div className="text-center">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-assis-blue sm:text-[10px]">
                    Order
                  </p>
                  <p className="mt-0.5 font-display text-sm font-bold text-foreground sm:text-lg">
                    #4821
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <div className="flex flex-col items-start gap-2.5">
              {AFTER.map((line, i) => (
                <motion.span
                  key={line}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="max-w-[9.5rem] rounded-2xl bg-white px-3 py-2 text-[11px] leading-snug text-foreground/70 shadow-sm sm:max-w-[14rem] sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  &ldquo;{line}&rdquo;
                </motion.span>
              ))}
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-assis-blue/60">
                After
              </p>
            </div>
          </div>
        </div>

        <ScrollReveal delay={0.15} className="mt-14 sm:mt-16">
          <p className="font-display text-center text-xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
            You lose the customer{" "}
            <span className="text-assis-blue">in the relationship.</span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
