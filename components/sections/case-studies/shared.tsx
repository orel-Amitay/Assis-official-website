"use client";

import { motion } from "framer-motion";

export function Chip({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-full px-4 py-2 text-xs text-foreground/70 sm:text-sm"
    >
      {children}
    </motion.span>
  );
}

export function ChatBubble({
  from,
  children,
  delay = 0,
}: {
  from: "customer" | "assis";
  children: React.ReactNode;
  delay?: number;
}) {
  const isAssis = from === "assis";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay }}
      className={`flex ${isAssis ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-[15px] ${
          isAssis
            ? "glass-blue text-foreground"
            : "bg-foreground/10 text-foreground/85"
        }`}
      >
        {!isAssis && <span className="mb-1 block text-[11px] uppercase tracking-wide text-foreground/40">Customer</span>}
        {isAssis && <span className="mb-1 block text-[11px] uppercase tracking-wide text-assis-blue-soft">ASSIS</span>}
        {children}
      </div>
    </motion.div>
  );
}

export function StatPill({
  label,
  value,
  positive,
  sub,
  delay = 0,
}: {
  label: string;
  value: string;
  positive: boolean;
  sub?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, delay }}
      className={`rounded-2xl px-5 py-4 ${positive ? "glass-blue" : "glass"}`}
    >
      <p className="text-xs uppercase tracking-wide text-foreground/40">{label}</p>
      <p
        className={`font-display mt-1 text-2xl font-semibold sm:text-3xl ${
          positive ? "text-assis-blue-soft" : "text-foreground/50"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-foreground/40">{sub}</p>}
    </motion.div>
  );
}

export function SplitColumn({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "gray" | "blue";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex h-full flex-col gap-5 rounded-3xl p-6 sm:p-8 ${
        tone === "blue" ? "glass-blue" : "glass opacity-80"
      }`}
    >
      <h4
        className={`font-display text-sm font-semibold uppercase tracking-wide ${
          tone === "blue" ? "text-assis-blue-soft" : "text-foreground/40"
        }`}
      >
        {title}
      </h4>
      {children}
    </div>
  );
}
