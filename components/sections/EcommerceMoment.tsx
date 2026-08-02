"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const MESSAGES = [
  { side: "left", text: "Will this arrive by Friday?" },
  { side: "right", text: "Which one should I choose?" },
  { side: "left", text: "Where is my order?" },
  { side: "right", text: "This isn't what I expected." },
  { side: "left", text: "I want a refund." },
  { side: "right", text: "I'm never buying here again." },
];

const STATUSES = ["Paid", "Fulfilled", "Delivered"];

export default function EcommerceMoment() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [visible, setVisible] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    MESSAGES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisible(i + 1), 350 + i * 420));
    });
    STATUSES.forEach((_, i) => {
      timers.push(setTimeout(() => setStatusIdx(i), 400 + i * 850));
    });
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <section
      id="reality"
      className="relative scroll-mt-20 overflow-hidden bg-[#07152c] px-6 py-20 sm:px-10 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-56 w-[480px] -translate-x-1/2 rounded-full bg-assis-blue/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl" ref={ref}>
        <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-1 backdrop-blur-sm">
          <div className="rounded-[1.85rem] bg-gradient-to-br from-assis-blue/15 via-transparent to-white/[0.03] px-5 py-8 sm:px-10 sm:py-10">
            <div className="mb-10 flex items-center justify-center gap-2 sm:gap-3">
              {STATUSES.map((s, i) => (
                <motion.span
                  key={s}
                  animate={{
                    opacity: i <= statusIdx ? 1 : 0.25,
                    color: i <= statusIdx ? "#ffffff" : "rgba(255,255,255,0.35)",
                  }}
                  className="text-[10px] font-bold uppercase tracking-[0.16em]"
                >
                  {s}
                  {i < STATUSES.length - 1 && (
                    <span className="ml-2 text-white/20 sm:ml-3">·</span>
                  )}
                </motion.span>
              ))}
            </div>

            <div className="relative flex min-h-[280px] flex-col items-center justify-center sm:min-h-[300px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                className="relative z-10 rounded-3xl border border-assis-blue/35 bg-assis-blue/20 px-8 py-5 shadow-[0_20px_60px_-28px_rgba(29,111,238,0.7)]"
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-assis-blue-soft">
                  Order
                </p>
                <p className="font-display mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  #4821
                </p>
              </motion.div>

              <div className="pointer-events-none absolute inset-0">
                {MESSAGES.map((msg, i) => {
                  const show = i < visible;
                  const top = 8 + (i % 3) * 28;
                  const isLeft = msg.side === "left";
                  return (
                    <AnimatePresence key={msg.text}>
                      {show && (
                        <motion.div
                          initial={{ opacity: 0, y: 12, x: isLeft ? -12 : 12 }}
                          animate={{ opacity: 1, y: 0, x: 0 }}
                          className={`absolute max-w-[42%] rounded-2xl border border-white/12 bg-white/[0.08] px-3.5 py-2.5 text-[11px] leading-snug text-white/75 sm:max-w-[38%] sm:text-xs ${
                            isLeft ? "left-0" : "right-0"
                          }`}
                          style={{ top: `${top}%` }}
                        >
                          &ldquo;{msg.text}&rdquo;
                        </motion.div>
                      )}
                    </AnimatePresence>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <ScrollReveal delay={0.2} className="mt-14 sm:mt-16">
          <p className="font-display text-center text-2xl font-bold tracking-[-0.035em] text-white sm:text-4xl">
            Ecommerce sees an order.
            <br />
            <span className="text-assis-blue-soft">We see the relationship around it.</span>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
