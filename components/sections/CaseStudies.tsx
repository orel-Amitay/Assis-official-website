"use client";

import { motion } from "framer-motion";

const CASES = [
  {
    industry: "SaaS - Productivity tool",
    stat: "2.4×",
    statLabel: "Free trial conversion rate",
    desc: "A productivity SaaS was losing 76% of trial users without knowing why. Assis started conversations 3 days before trial end - and more than doubled conversions within 60 days.",
    company: "B2B SaaS · 340 active accounts · $1.2M ARR",
  },
  {
    industry: "SaaS - HR platform",
    stat: "71%",
    statLabel: "Of month-1 cancellations recovered",
    desc: "First-month churn was their biggest problem. Assis caught customers at the exact moment they were considering leaving - 71% stayed or moved to a higher plan.",
    company: "SMB SaaS · 1,100 subscribers",
  },
  {
    industry: "SaaS - Analytics platform",
    stat: "34%",
    statLabel: "Churn reduction in 6 months",
    desc: "Assis conversations surfaced 47 distinct product issues. The team fixed the top 6. Churn dropped by a third - not from better sales, but from finally understanding why customers left.",
    company: "Developer tooling · 600 paying customers",
  },
];

export default function CaseStudies() {
  return (
    <section id="cases" className="bg-white px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-assis-blue-light px-3 py-1 text-xs font-bold uppercase tracking-widest text-assis-blue">
            Results
          </span>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.025em] text-foreground sm:text-5xl">
            Not retention metrics.
            <br />
            Revenue saved.
          </h2>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <motion.div
              key={c.industry}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-2xl border border-border p-8 transition-all hover:-translate-y-0.5 hover:border-assis-blue/20 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.1)]"
            >
              <p className="mb-5 text-xs font-bold uppercase tracking-widest text-assis-blue">
                {c.industry}
              </p>
              <div className="font-display text-5xl font-bold tracking-[-0.04em] text-foreground sm:text-6xl">
                {c.stat}
              </div>
              <p className="mt-2 text-base font-semibold text-foreground">{c.statLabel}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              <div className="mt-6 border-t border-border pt-5 text-xs text-muted-foreground/60">
                {c.company}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
