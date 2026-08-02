"use client";

import { motion } from "framer-motion";
import { ChatBubble, StatPill } from "./case-studies/shared";

function BrandBubble({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay }}
      className="flex justify-end"
    >
      <div className="max-w-[85%] rounded-2xl bg-foreground/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground/55 sm:text-[15px]">
        <span className="mb-1 block text-[11px] uppercase tracking-wide text-foreground/35">
          Brand &middot; automated
        </span>
        {children}
      </div>
    </motion.div>
  );
}

export default function ChatSimulation() {
  return (
    <section className="relative bg-background py-32 sm:py-40">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl font-medium leading-tight text-foreground sm:text-5xl"
        >
          What it actually looks like.
        </motion.h2>
      </div>

      <div className="mx-auto mt-16 max-w-lg px-6">
        <div className="glass space-y-3 rounded-3xl p-5 sm:p-6">
          <ChatBubble from="customer" delay={0}>
            I want to cancel.
          </ChatBubble>
          <BrandBubble delay={0.1}>
            We&rsquo;re sorry to see you go. Here&rsquo;s 20% off.
          </BrandBubble>
          <ChatBubble from="customer" delay={0.2}>
            No thanks.
          </ChatBubble>
          <ChatBubble from="assis" delay={0.3}>
            Can I ask why?
          </ChatBubble>
          <ChatBubble from="customer" delay={0.4}>
            Honestly, I&rsquo;m overwhelmed and not using it.
          </ChatBubble>
          <ChatBubble from="assis" delay={0.5}>
            Would pausing for 2 months help?
          </ChatBubble>
          <ChatBubble from="customer" delay={0.6}>
            Actually yes.
          </ChatBubble>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-4"
        >
          <span className="glass-blue rounded-full px-4 py-2 text-sm font-medium text-assis-blue-soft">
            ✅ Customer Retained
          </span>
          <StatPill label="Recovered LTV" value="+$1,200" positive />
        </motion.div>
      </div>
    </section>
  );
}
