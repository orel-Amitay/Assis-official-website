"use client";

import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import PositionLink from "@/components/PositionLink";

const STACK = [
  { who: "Shopify", role: "Store" },
  { who: "3PL", role: "Fulfillment" },
  { who: "Payments", role: "Checkout" },
  { who: "Marketing", role: "Acquisition" },
];

export default function NotAnotherTool() {
  return (
    <section id="category" className="scroll-mt-20 bg-[#09090b] px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-bold tracking-[-0.035em] text-white sm:text-5xl">
            Your stack is managed.
          </h2>
        </ScrollReveal>

        <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4">
          {STACK.map((item, i) => (
            <ScrollReveal key={item.who} delay={0.06 + i * 0.06}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-4">
                <p className="font-display text-sm font-bold text-zinc-200">{item.who}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                  {item.role}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3} className="mt-12 flex flex-col items-center sm:mt-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            Who manages the relationship?
          </p>
          <div className="mt-6 w-full max-w-sm">
            <PositionLink variant="dark" size="lg" className="mx-auto" />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-display mt-10 text-5xl font-bold tracking-[-0.04em] text-assis-blue-soft sm:text-7xl"
          >
            Assis.
          </motion.p>
          <p className="mt-4 text-sm text-zinc-500 sm:text-base">
            Not software you operate. An operation we run.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
