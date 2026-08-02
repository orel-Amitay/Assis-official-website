"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const ASKS = [
  "Do you sell this?",
  "Can I order this from you?",
  "Why don't you carry it?",
  "Do you sell this?",
  "Can I order this from you?",
];

const STAGES = ["Pattern detected", "Business decision", "Product added", "Bestseller"] as const;

export default function SharpCase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [played, setPlayed] = useState(false);
  const [stack, setStack] = useState(0);
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    if (!inView || played) return;
    setPlayed(true);
    const timers: ReturnType<typeof setTimeout>[] = [];
    ASKS.forEach((_, i) => {
      timers.push(setTimeout(() => setStack(i + 1), 200 + i * 260));
    });
    STAGES.forEach((_, i) => {
      timers.push(setTimeout(() => setStage(i), 1600 + i * 650));
    });
    return () => timers.forEach(clearTimeout);
  }, [inView, played]);

  return (
    <section id="cases" className="scroll-mt-20 px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-3xl" ref={ref}>
        <ScrollReveal>
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            Customer story
          </p>
          <div className="mt-5 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/sharp-logo.png" alt="SHARP" className="h-5 w-auto object-contain" />
          </div>
          <h2 className="font-display mx-auto mt-6 max-w-xl text-center text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
            Sometimes customers tell you what to sell.
          </h2>
        </ScrollReveal>

        <div className="relative mx-auto mt-12 h-[160px] max-w-md sm:mt-14 sm:h-[180px]">
          {ASKS.map((ask, i) => {
            if (i >= stack) return null;
            const offset = (stack - 1 - i) * 10;
            const scale = 1 - (stack - 1 - i) * 0.04;
            return (
              <div
                key={`${ask}-${i}`}
                className="absolute inset-x-0 top-8 rounded-2xl border border-border bg-white px-5 py-3.5 text-center text-sm text-foreground/70 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.12)] transition-all duration-300"
                style={{ zIndex: i, transform: `translateY(${-offset}px) scale(${scale})` }}
              >
                &ldquo;{ask}&rdquo;
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {STAGES.map((s, i) => {
            const on = stage >= i;
            const isLast = i === STAGES.length - 1;
            return (
              <span
                key={s}
                className={`rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-opacity sm:text-[11px] ${
                  on && isLast
                    ? "bg-assis-blue text-white"
                    : on
                      ? "border border-assis-blue/25 text-assis-blue"
                      : "border border-border text-zinc-400 opacity-30"
                }`}
              >
                {s}
              </span>
            );
          })}
        </div>

        {stage >= STAGES.length - 1 && (
          <p className="mt-10 text-center text-sm text-zinc-500 sm:mt-12 sm:text-base">
            The middle sees what neither side can see alone.
          </p>
        )}
      </div>
    </section>
  );
}
