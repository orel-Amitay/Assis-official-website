"use client";

import { motion } from "framer-motion";

const DIFFS = [
  {
    icon: "🎯",
    title: "Outcome-based, not feature-based",
    desc: "We don't sell software. We deliver results. Every engagement is tied to a measurable business outcome — retention, recovery, or revenue growth.",
  },
  {
    icon: "🔗",
    title: "The entire customer journey",
    desc: "Most tools cover one moment. Assis covers every moment — from first contact to cancellation intent — with a single, coherent platform.",
  },
  {
    icon: "💡",
    title: "Relationships, not resolutions",
    desc: "We measure success in trust, retention, and lifetime value — not tickets closed or response times. Because relationships outlast any single transaction.",
  },
  {
    icon: "⚡",
    title: "Built for scale, designed for humans",
    desc: "Assis operates at the scale your team can't — across thousands of conversations simultaneously — while keeping every interaction feeling personal.",
  },
  {
    icon: "🏭",
    title: "Industry-specific intelligence",
    desc: "Ecommerce and SaaS have different relationship dynamics. Assis is purpose-built for both — not a generic solution applied to your industry.",
  },
  {
    icon: "📊",
    title: "CLV as the north star",
    desc: "Everything we build, measure, and optimize is connected to one outcome: growing the long-term value of your customer relationships.",
  },
];

export default function Differentiators() {
  return (
    <section id="why-assis" className="bg-[#09090b] px-6 py-24 sm:px-10 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-assis-blue-light px-3 py-1 text-xs font-bold uppercase tracking-widest text-assis-blue">
            Why Assis
          </span>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.025em] text-white sm:text-5xl">
            Built differently. Because the problem is different.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/50">
            We didn&rsquo;t build another support tool. We built a relationship platform — because
            the companies that win long-term treat every customer conversation as a
            relationship investment.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIFFS.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.04] p-7"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-assis-blue/10 text-xl">
                {d.icon}
              </div>
              <h3 className="font-display mb-2 text-base font-semibold text-white">{d.title}</h3>
              <p className="text-sm leading-relaxed text-white/45">{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
