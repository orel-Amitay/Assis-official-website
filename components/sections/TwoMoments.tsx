"use client";

import { motion } from "framer-motion";
import { SplitColumn } from "./case-studies/shared";

interface Moment {
  title: string;
  customerQuote: string;
  brandFails: string[];
  assisQuote: string;
  results: string[];
}

const MOMENTS: Moment[] = [
  {
    title: "Before They Buy",
    customerQuote: "“I’m not sure.”",
    brandFails: ["FAQ", "Generic Chatbot"],
    assisQuote: "“I’ll help you figure out if this is right for you.”",
    results: ["Higher Conversion", "More Trust", "Better LTV"],
  },
  {
    title: "Before They Leave",
    customerQuote: "“I want to cancel.”",
    brandFails: ["Discount popup", "Exit survey"],
    assisQuote: "“Tell me what happened.”",
    results: ["Recovered Revenue", "Saved Customers", "Higher Retention"],
  },
];

export default function TwoMoments() {
  return (
    <section id="moments" className="relative bg-background py-32 sm:py-40">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl font-medium leading-tight text-foreground sm:text-5xl"
        >
          Every customer reaches{" "}
          <span className="text-assis-blue-soft">two defining moments.</span>
        </motion.h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 px-6 sm:grid-cols-2">
        {MOMENTS.map((moment, i) => (
          <motion.div
            key={moment.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: i * 0.12 }}
          >
            <SplitColumn title={moment.title} tone="blue">
              <p className="font-display text-lg text-foreground sm:text-xl">
                {moment.customerQuote}
              </p>

              <div className="space-y-1.5">
                {moment.brandFails.map((fail) => (
                  <p key={fail} className="text-sm text-foreground/35 line-through">
                    ❌ {fail}
                  </p>
                ))}
              </div>

              <div className="glass-blue rounded-2xl px-4 py-3">
                <span className="mb-1 block text-[11px] uppercase tracking-wide text-assis-blue-soft">
                  💙 ASSIS
                </span>
                <p className="text-sm text-foreground sm:text-base">{moment.assisQuote}</p>
              </div>

              <ul className="space-y-1 text-sm text-foreground/65">
                {moment.results.map((result) => (
                  <li key={result}>✓ {result}</li>
                ))}
              </ul>
            </SplitColumn>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mx-auto mt-16 max-w-2xl px-6 text-center"
      >
        <p className="text-base text-foreground/50 sm:text-lg">
          We don&rsquo;t optimize transactions.
        </p>
        <p className="font-display mt-1 text-2xl font-semibold text-assis-blue-soft sm:text-3xl">
          We optimize relationships.
        </p>
      </motion.div>
    </section>
  );
}
