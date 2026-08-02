"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FAQ_ITEMS } from "@/data/base44";
import MaterialIcon from "./MaterialIcon";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center md:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
            FAQ
          </p>
          <h2 className="mt-3 font-headline text-3xl font-bold tracking-tight text-[hsl(var(--navy-accent))] sm:text-4xl">
            Questions store owners ask.
          </h2>
        </div>

        <div className="divide-y divide-[hsl(var(--outline-variant)/0.3)] rounded-2xl border border-[hsl(var(--outline-variant)/0.3)] bg-white/60">
          {FAQ_ITEMS.map((item, i) => (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6 sm:py-6"
              >
                <span className="font-headline text-[15px] font-semibold text-[hsl(var(--on-surface))] sm:text-base">
                  {item.q}
                </span>
                <MaterialIcon
                  name="expand_more"
                  className={`shrink-0 text-2xl text-[hsl(var(--on-surface-variant))] transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-[hsl(var(--on-surface-variant))] sm:px-6 sm:pb-6">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
