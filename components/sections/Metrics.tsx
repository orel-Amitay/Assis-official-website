"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedValue({
  value,
  inView,
}: {
  value: string;
  inView: boolean;
}) {
  const isPercent = value.includes("%") && !value.startsWith("<");
  const isX = value.toUpperCase().includes("X");
  const numeric = parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
  const [display, setDisplay] = useState(isX ? "0X" : isPercent ? "0%" : value);

  useEffect(() => {
    if (!inView) return;
    if (!isPercent && !isX) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const duration = 1100;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(numeric * eased);
      setDisplay(isX ? `${current}X` : `${current}%`);
      if (t < 1) frame = requestAnimationFrame(tick);
      else
        setDisplay(
          value.replace("×", "X").includes("X") && isX ? `${Math.round(numeric)}X` : value,
        );
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, isPercent, isX, numeric, value]);

  return <span>{display}</span>;
}

const STATS = [
  { value: "6X", label: "ROI", note: "on every $ spent with Assis" },
  { value: "43%", label: "Conversion", note: "average across stores" },
  { value: "4.9", label: "Google rating", note: "avg. across stores", stars: true },
] as const;

export default function Metrics() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section id="metrics" className="scroll-mt-20 px-5 py-8 sm:px-10 sm:py-10">
      <div
        ref={ref}
        className="mx-auto grid max-w-3xl grid-cols-1 gap-7 min-[420px]:grid-cols-3 min-[420px]:gap-2 sm:flex sm:items-center sm:justify-center sm:gap-0"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.07 * i, duration: 0.4 }}
            className={`flex flex-col items-center text-center sm:flex-1 sm:px-8 ${
              i > 0 ? "min-[420px]:border-l min-[420px]:border-zinc-200/80" : ""
            }`}
          >
            <div className="flex items-baseline justify-center gap-1.5">
              <p className="font-display text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
                <AnimatedValue value={stat.value} inView={inView} />
              </p>
              {"stars" in stat && stat.stars ? (
                <span
                  className="text-base tracking-tight text-[#f4b400] sm:text-lg"
                  aria-label="4.9 stars"
                >
                  ★★★★★
                </span>
              ) : null}
            </div>
            <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
              {stat.label}
            </p>
            <p className="mt-1 text-[11px] text-zinc-400">{stat.note}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
