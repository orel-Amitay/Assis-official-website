"use client";

import { motion } from "framer-motion";

export default function PricingModel() {
  return (
    <section className="relative bg-background py-32 sm:py-40">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl font-medium leading-tight text-foreground sm:text-6xl"
        >
          You only pay
          <br />
          <span className="text-assis-blue-soft">when LTV grows.</span>
        </motion.h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-3xl gap-6 px-6 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="glass flex flex-col gap-3 rounded-3xl p-7 text-center opacity-80"
        >
          <span className="text-sm text-foreground/45">Customer leaves</span>
          <span className="text-xs uppercase tracking-wide text-foreground/35">You pay</span>
          <span className="font-display text-4xl font-semibold text-foreground/50">$0</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-blue flex flex-col gap-3 rounded-3xl p-7 text-center"
        >
          <span className="text-sm text-foreground/70">Customer stays</span>
          <div>
            <span className="text-xs uppercase tracking-wide text-foreground/45">Recovered LTV</span>
            <p className="font-display text-2xl font-semibold text-assis-blue-soft">
              $3,000
            </p>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-foreground/45">You pay &middot; 10%</span>
            <p className="font-display text-4xl font-semibold text-foreground">$300</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mx-auto mt-16 max-w-xl px-6 text-center"
      >
        <p className="text-base text-foreground/55 sm:text-lg">
          Our incentives are identical to yours.
        </p>
        <p className="font-display mt-1 text-xl font-medium text-foreground sm:text-2xl">
          If we don&rsquo;t grow LTV, we don&rsquo;t get paid.
        </p>
      </motion.div>
    </section>
  );
}
