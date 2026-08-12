"use client";

import { motion } from "framer-motion";

const BLIND_SPOTS = [
  {
    icon: "📉",
    title: "Your churn report is a number, not a reason.",
    desc: "You know 12% churned. You don't know if it was pricing, a missing feature, a bad onboarding experience, or something you could've fixed with a single conversation.",
  },
  {
    icon: "🔄",
    title: "You're fixing the wrong things.",
    desc: "Without real feedback from the customers who left, product decisions are based on the customers who stayed - a fundamentally biased sample.",
  },
  {
    icon: "🔇",
    title: "Silent exits are the most expensive.",
    desc: "A customer who complains is a customer you can help. A customer who disappears is a customer you've lost twice - once to churn, once to the insight you never got.",
  },
  {
    icon: "🎯",
    title: "One conversation can save dozens of future customers.",
    desc: "When you understand why user #47 left, you can prevent users #48-#500 from leaving for the same reason. That's the compounding value of every conversation Assis has.",
  },
];

export default function WhyRelationships() {
  return (
    <section id="why" className="bg-white px-6 py-24 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-assis-blue-light px-3 py-1 text-xs font-bold uppercase tracking-widest text-assis-blue">
            Why it matters
          </span>
          <h2 className="font-display mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.025em] text-foreground sm:text-5xl">
            You&rsquo;re building your product blind.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every customer who leaves without a conversation takes a piece of
            knowledge with them. Multiply that by your monthly churn rate, and
            you&rsquo;ll understand why the product keeps missing.
          </p>
        </motion.div>

        {/* Blind-spot chain */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-14"
        >
          {/* Desktop */}
          <div className="hidden items-center justify-center lg:flex">
            {[
              "Customer leaves",
              "No conversation",
              "No data",
              "Wrong decisions",
              "More churn",
            ].map((item, i, arr) => (
              <div key={item} className="flex items-center">
                <div className={`rounded-2xl px-5 py-3 text-center ${
                  i === arr.length - 1
                    ? "bg-red-50 text-red-500"
                    : "bg-zinc-100 text-zinc-500"
                }`}>
                  <span className="font-display text-sm font-bold">{item}</span>
                </div>
                {i < arr.length - 1 && (
                  <span className="mx-3 text-lg text-zinc-300">→</span>
                )}
              </div>
            ))}
          </div>
          {/* Mobile */}
          <div className="flex flex-col items-center gap-1 lg:hidden">
            {["Customer leaves", "No conversation", "No data", "Wrong decisions", "More churn"].map(
              (item, i, arr) => (
                <div key={item} className="flex flex-col items-center gap-1">
                  <div className={`rounded-2xl px-5 py-2 text-sm font-bold ${
                    i === arr.length - 1 ? "bg-red-50 text-red-500" : "bg-zinc-100 text-zinc-500"
                  }`}>
                    {item}
                  </div>
                  {i < arr.length - 1 && (
                    <span className="text-sm leading-none text-zinc-300">↓</span>
                  )}
                </div>
              )
            )}
          </div>
        </motion.div>

        {/* Blind spots grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BLIND_SPOTS.map((spot, i) => (
            <motion.div
              key={spot.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl bg-zinc-50 p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                {spot.icon}
              </div>
              <h3 className="font-display mb-2 text-sm font-semibold leading-snug text-foreground">
                {spot.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{spot.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
