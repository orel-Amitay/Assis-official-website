"use client";

import { motion } from "framer-motion";

const MOMENTS = [
  {
    tag: "Moment 1",
    phase: "Trial → Paid",
    title: "The trial cliff.",
    desc: "Your trial window closes. Most users haven't upgraded. Some were genuinely busy. Some had objections nobody addressed. Some needed one more reason to say yes.",
    problem: "What you see: 0% conversion on that cohort.",
    what_you_miss: "What you miss: every reason they didn't convert.",
    items: [
      "Haven't seen the core value yet",
      "Price feels uncertain",
      "Needs a nudge at the right moment",
      "Has a specific objection nobody heard",
    ],
    outcome: "Assis has that conversation. Before the trial ends.",
  },
  {
    tag: "Moment 2",
    phase: "First Payment → Churn",
    title: "The first-month drop.",
    desc: "They paid. They believed in you enough to enter a credit card. Then something happened - and they didn't renew. This is the most expensive churn there is.",
    problem: "What you see: first-month churn rate.",
    what_you_miss: "What you miss: exactly when and why it broke.",
    items: [
      "Didn't reach the moment of value in time",
      "Got stuck and didn't ask for help",
      "Expected something different",
      "Felt like just another account",
    ],
    outcome: "Assis catches them before they decide to leave.",
  },
];

export default function CustomerJourney() {
  return (
    <section id="journey" className="bg-white px-6 py-24 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-assis-blue-light px-3 py-1 text-xs font-bold uppercase tracking-widest text-assis-blue">
            The two moments
          </span>
          <h2 className="font-display mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.025em] text-foreground sm:text-5xl">
            Two moments decide
            <br />
            your entire retention curve.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Every SaaS company has the same two holes in the bucket. Most just
            don&rsquo;t know what falls through them - or why.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {MOMENTS.map((moment, i) => (
            <motion.div
              key={moment.tag}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-border bg-white p-8 sm:p-10"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="inline-block rounded-full bg-assis-blue-light px-3 py-1 text-xs font-bold uppercase tracking-widest text-assis-blue">
                  {moment.tag}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {moment.phase}
                </span>
              </div>

              <h3 className="font-display mb-3 text-2xl font-bold leading-snug tracking-tight text-foreground">
                {moment.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {moment.desc}
              </p>

              {/* What you see vs miss */}
              <div className="mb-6 space-y-2 rounded-xl bg-zinc-50 p-5">
                <p className="text-sm text-muted-foreground line-through opacity-50">
                  {moment.problem}
                </p>
                <p className="text-sm font-medium text-foreground">
                  {moment.what_you_miss}
                </p>
              </div>

              {/* Reasons */}
              <ul className="mb-6 space-y-3">
                {moment.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-foreground/75"
                  >
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-assis-blue" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Assis outcome */}
              <div className="glass-blue rounded-xl px-5 py-4">
                <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-assis-blue">
                  What Assis does
                </span>
                <p className="text-sm font-semibold text-assis-blue">
                  {moment.outcome}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
