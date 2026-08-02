"use client";

import { motion } from "framer-motion";

const COMPANIES = [
  "Shopify Plus",
  "Wix",
  "Elementor",
  "monday.com",
  "Fiverr",
  "Taboola",
];

export default function SocialProof() {
  return (
    <section className="border-y border-border bg-white py-14">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground/60"
        >
          Trusted by companies that take customer relationships seriously
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-5"
        >
          {COMPANIES.map((name) => (
            <span
              key={name}
              className="font-display select-none text-base font-semibold tracking-tight text-zinc-300"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
