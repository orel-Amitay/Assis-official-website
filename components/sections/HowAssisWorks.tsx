"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import SectionAtmosphere from "@/components/SectionAtmosphere";

const PHASES = [
  {
    label: "Before purchase",
    chips: ["Questions", "Hesitation", "Trust"],
    result: "We move customers forward.",
  },
  {
    label: "After purchase",
    chips: ["Orders", "Refunds", "Problems"],
    result: "We protect the relationship.",
  },
  {
    label: "Behind the conversations",
    chips: ["Patterns", "Friction", "Opportunities"],
    result: "We move the business forward.",
  },
];

export default function HowAssisWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % PHASES.length), 2800);
    return () => clearInterval(id);
  }, [inView, paused]);

  return (
    <section
      id="how"
      className="relative scroll-mt-20 overflow-hidden bg-[#0a1a36] px-6 py-20 sm:px-10 sm:py-28"
    >
      <SectionAtmosphere variant="dark" />
      <div className="relative mx-auto max-w-5xl" ref={ref}>
        <ScrollReveal>
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-assis-blue-soft/70">
            How Assis works
          </p>
          <h2 className="mt-4 font-display text-center text-3xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
            One operation.
            <br />
            <span className="text-assis-blue-soft/85">The entire customer relationship.</span>
          </h2>
        </ScrollReveal>

        <div
          className="relative mx-auto mt-12 max-w-3xl sm:mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="absolute left-0 right-0 top-4 hidden h-px bg-white/10 sm:block" />
          <motion.div
            className="absolute left-0 top-4 hidden h-px origin-left bg-assis-blue sm:block"
            animate={{ scaleX: (active + 1) / 3 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "100%" }}
          />

          <div className="grid gap-6 sm:grid-cols-3 sm:gap-4">
            {PHASES.map((phase, i) => {
              const on = active === i;
              return (
                <button
                  key={phase.label}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="text-left"
                >
                  <div className="mb-4 hidden justify-center sm:flex">
                    <motion.span
                      animate={{
                        scale: on ? 1.4 : 1,
                        backgroundColor: on ? "#1d6fee" : "rgba(255,255,255,0.2)",
                      }}
                      className="h-2 w-2 rounded-full"
                    />
                  </div>
                  <motion.div
                    animate={{
                      borderColor: on ? "rgba(29,111,238,0.55)" : "rgba(255,255,255,0.08)",
                      backgroundColor: on ? "rgba(29,111,238,0.14)" : "rgba(255,255,255,0.02)",
                      y: on ? -4 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 280, damping: 22 }}
                    className="rounded-3xl border px-4 py-5 shadow-[0_20px_50px_-30px_rgba(29,111,238,0.45)]"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-assis-blue-soft">
                      {phase.label}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {phase.chips.map((c) => (
                        <motion.span
                          key={c}
                          animate={{
                            borderColor: on ? "rgba(29,111,238,0.35)" : "rgba(255,255,255,0.1)",
                            color: on ? "rgba(255,255,255,0.85)" : "rgba(161,161,170,1)",
                          }}
                          className="rounded-full border px-2.5 py-1 text-[11px]"
                        >
                          {c}
                        </motion.span>
                      ))}
                    </div>
                    <p className="mt-5 font-display text-sm font-semibold text-white sm:text-base">
                      {phase.result}
                    </p>
                  </motion.div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
