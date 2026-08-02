"use client";

import { motion } from "framer-motion";
import Heart from "../heart/Heart";

const TAGS = ["Neutral", "Trusted", "AI + Human", "LTV Driven"];

export default function RelationshipDiagram() {
  return (
    <section className="relative overflow-hidden bg-background py-32 sm:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,75,204,0.1),transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl font-medium leading-tight text-foreground sm:text-5xl"
        >
          We don&rsquo;t work for brands.
          <br />
          <span className="text-assis-blue-soft">
            We work for the relationship.
          </span>
        </motion.h2>
      </div>

      <div className="relative mx-auto mt-24 flex max-w-3xl items-center justify-between px-6 sm:px-12">
        <div className="absolute left-0 right-0 top-1/2 z-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />

        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="glass relative z-10 flex h-20 w-20 items-center justify-center rounded-full text-sm font-medium text-foreground/70 sm:h-28 sm:w-28 sm:text-base"
        >
          Brand
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="group relative z-10 flex flex-col items-center"
        >
          <div className="pointer-events-none absolute -top-14 left-1/2 w-48 -translate-x-1/2 rounded-2xl px-3 py-2 text-center text-xs text-assis-blue-soft opacity-0 transition-opacity duration-300 group-hover:opacity-100 glass-blue">
            “We found the real reason.”
          </div>
          <Heart state="strong" size={110} />
          <span className="font-display -mt-2 text-sm font-semibold text-assis-blue-soft sm:text-base">
            ASSIS
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="group relative z-10 flex h-20 w-20 items-center justify-center rounded-full text-sm font-medium text-foreground/70 sm:h-28 sm:w-28 sm:text-base"
        >
          <div className="glass flex h-full w-full items-center justify-center rounded-full">
            Customer
          </div>
          <div className="pointer-events-none absolute -top-14 left-1/2 w-48 -translate-x-1/2 rounded-2xl px-3 py-2 text-center text-xs text-foreground/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 glass">
            “I&rsquo;m leaving because&hellip;”
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="relative z-10 mt-16 flex flex-wrap items-center justify-center gap-3 px-6"
      >
        {TAGS.map((tag) => (
          <span
            key={tag}
            className="glass rounded-full px-4 py-1.5 text-xs text-foreground/60 sm:text-sm"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
