"use client";

import { motion } from "framer-motion";
import Heart from "../heart/Heart";

export default function FinalSection() {
  return (
    <section
      id="demo"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-32 text-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,75,204,0.12),transparent_65%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Heart state="strong" size={300} particles />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="mx-auto mt-14 max-w-2xl space-y-3 text-base text-foreground/60 sm:text-xl"
      >
        <p>Your customers already tell you when they are unsure.</p>
        <p className="text-foreground/90">
          They already tell you when they are about to leave.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.9, delay: 0.45 }}
        className="mt-14"
      >
        <p className="font-display text-xl text-foreground/70 sm:text-2xl">
          Every company owns transactions.
        </p>
        <p className="font-display mt-2 text-4xl font-bold text-assis-blue-soft sm:text-6xl">
          We own the relationship.
        </p>
      </motion.div>

      <motion.a
        href="mailto:hello@assis.ai"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, delay: 0.65 }}
        className="mt-12 rounded-full bg-assis-blue px-8 py-4 text-base font-medium text-white shadow-[0_14px_30px_-6px_rgba(0,75,204,0.5)] transition hover:bg-assis-blue-deep sm:text-lg"
      >
        Start Growing LTV
      </motion.a>

      <p className="mt-20 text-xs uppercase tracking-[0.3em] text-foreground/30">
        ASSIS &mdash; We Own The Relationship.
      </p>
    </section>
  );
}
