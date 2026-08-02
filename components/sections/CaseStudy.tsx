"use client";

import { motion } from "framer-motion";
import { Chip, SplitColumn, StatPill } from "./case-studies/shared";

function ProgressBar({ label, value, delay = 0 }: { label: string; value: number; delay?: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-foreground/50">
        <span>{label}</span>
        <span className="text-assis-blue-soft">{value}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-foreground/10">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full bg-assis-blue"
          style={{ boxShadow: "0 0 12px rgba(0,75,204,0.7)" }}
        />
      </div>
    </div>
  );
}

export default function CaseStudy() {
  return (
    <section className="relative bg-background py-32 sm:py-40">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Chip>A real example</Chip>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
          className="font-display mt-6 text-3xl font-medium leading-tight text-foreground sm:text-5xl"
        >
          <span className="text-assis-blue-soft">WarmIntro</span> was
          losing trial users they never even talked to.
        </motion.h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 px-6 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <SplitColumn title="Before" tone="gray">
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>Users cancel after free trial</li>
              <li>Retention decreases as volume grows</li>
              <li>Founders can&rsquo;t talk to everyone</li>
            </ul>
          </SplitColumn>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <SplitColumn title="ASSIS" tone="blue">
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>Intercepts the cancellation moment</li>
              <li>Understands the real reason</li>
              <li>Offers a pause, a new plan, or help</li>
            </ul>
          </SplitColumn>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SplitColumn title="After" tone="gray">
            <ProgressBar label="Recovered Users" value={42} delay={0.1} />
            <ProgressBar label="Expanded Plans" value={18} delay={0.25} />
            <StatPill label="LTV" value="↗︎↗︎↗︎" positive delay={0.4} />
          </SplitColumn>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mx-auto mt-16 max-w-xl px-6 text-center text-base text-foreground/55 sm:text-lg"
      >
        Customers stayed because the problem was solved.
        <br />
        <span className="text-foreground/90">Not because they were trapped.</span>
      </motion.p>
    </section>
  );
}
