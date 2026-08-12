"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookDemoButton } from "@/components/DemoModal";

type Tab = "ecommerce" | "saas";

const DATA: Record<Tab, { title: string; desc: string; examples: string[] }> = {
  ecommerce: {
    title: "Protect revenue at every point in the purchase cycle.",
    desc: "For Ecommerce brands, every customer interaction is either strengthening or weakening the chance of a repeat purchase. Assis manages the moments that determine whether a one-time buyer becomes a loyal customer.",
    examples: [
      "Product questions",
      "Checkout hesitation",
      "Shipping concerns",
      "Returns & exchanges",
      "Refund requests",
      "Customer loyalty",
      "Repeat purchases",
      "Post-purchase trust",
    ],
  },
  saas: {
    title: "Turn churn signals into expansion opportunities.",
    desc: "For SaaS companies, the most expensive customer is the one who leaves quietly. Assis identifies the moments of friction - trial expiry, downgrade intent, cancellation - and turns them into relationship conversations that recover and expand revenue.",
    examples: [
      "Trial expiration",
      "Subscription cancellation",
      "Downgrade intent",
      "Churn prevention",
      "Customer expansion",
      "Revenue recovery",
      "Reactivation",
      "Upsell moments",
    ],
  },
};

const LABELS: Record<Tab, string> = {
  ecommerce: "Ecommerce",
  saas: "SaaS",
};

export default function Industries() {
  const [tab, setTab] = useState<Tab>("ecommerce");
  const d = DATA[tab];

  return (
    <section id="industries" className="bg-zinc-50 px-6 py-24 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-assis-blue-light px-3 py-1 text-xs font-bold uppercase tracking-widest text-assis-blue">
            Industries
          </span>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.025em] text-foreground sm:text-5xl">
            One platform. Built for Ecommerce and SaaS.
          </h2>
        </motion.div>

        {/* Tab switcher */}
        <div className="mb-8 flex justify-center gap-2">
          {(["ecommerce", "saas"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-7 py-2.5 text-sm font-semibold transition-all ${
                tab === t
                  ? "bg-assis-blue text-white shadow-[0_4px_16px_-4px_rgba(29,111,238,0.45)]"
                  : "border border-border bg-white text-muted-foreground hover:text-foreground"
              }`}
            >
              {LABELS[t]}
            </button>
          ))}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl bg-white p-8 sm:p-12"
          >
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="inline-block rounded-full bg-assis-blue-light px-3 py-1 text-xs font-bold uppercase tracking-widest text-assis-blue">
                  {LABELS[tab]}
                </span>
                <h3 className="font-display mt-5 text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl">
                  {d.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">{d.desc}</p>
                <BookDemoButton className="mt-8 inline-block rounded-full bg-assis-blue px-7 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_-4px_rgba(29,111,238,0.45)] transition-all hover:bg-assis-blue-deep">
                  Talk to us about {LABELS[tab]} →
                </BookDemoButton>
              </div>
              <div className="grid grid-cols-2 gap-3 content-start">
                {d.examples.map((ex) => (
                  <div
                    key={ex}
                    className="rounded-xl bg-zinc-50 px-4 py-3.5 text-sm font-medium text-foreground/80"
                  >
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
