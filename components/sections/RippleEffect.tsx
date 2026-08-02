"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import AssisHeartMark from "@/components/AssisHeartMark";
import SectionAtmosphere from "@/components/SectionAtmosphere";
import { REVEAL_EASE } from "@/lib/scroll-pacing";

const OUTCOMES = [
  {
    title: "Trust",
    angle: -90,
    desc: "Customers respond differently when they don't have to fight the business.",
  },
  {
    title: "Sales",
    angle: -45,
    desc: "Questions are handled before they become lost purchases.",
  },
  {
    title: "Escalations",
    angle: 0,
    desc: "Customers don't need to fight to feel heard.",
  },
  {
    title: "Refunds",
    angle: 45,
    desc: "Friction is managed before a refund becomes the only outcome.",
  },
  {
    title: "Operations",
    angle: 90,
    desc: "Repeated conversations expose what is actually broken.",
  },
  {
    title: "Retention",
    angle: 135,
    desc: "Problems don't automatically end relationships.",
  },
  {
    title: "Revenue",
    angle: 180,
    desc: "More money stays inside the business.",
  },
  {
    title: "Reviews",
    angle: 225,
    desc: "Customers remember how the relationship was handled.",
  },
];

export default function RippleEffect() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [hover, setHover] = useState<string | null>(null);
  const [autoIdx, setAutoIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused) return;
    const id = setInterval(() => {
      setAutoIdx((i) => (i + 1) % OUTCOMES.length);
    }, 2000);
    return () => clearInterval(id);
  }, [inView, paused]);

  const activeTitle = hover ?? (inView ? OUTCOMES[autoIdx].title : null);
  const activeItem = OUTCOMES.find((o) => o.title === activeTitle);

  return (
    <section
      id="ripple"
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-white via-[#f4f8ff] to-white px-6 py-20 sm:px-10 sm:py-28"
    >
      <SectionAtmosphere variant="soft" />
      <div className="relative mx-auto max-w-5xl">
        <ScrollReveal>
          <h2 className="font-display text-center text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
            One change in position.
            <br />
            <span className="text-assis-blue">Impact everywhere.</span>
          </h2>
        </ScrollReveal>

        <div
          ref={ref}
          className="relative mx-auto mt-12 h-[380px] max-w-xl sm:mt-16 sm:h-[480px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full border border-assis-blue/35"
              style={{ width: 110, height: 110, marginLeft: -55, marginTop: -55 }}
              animate={
                inView
                  ? { scale: [1, 3], opacity: [0.55, 0] }
                  : { scale: 1, opacity: 0 }
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: "easeOut",
              }}
            />
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: REVEAL_EASE }}
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <AssisHeartMark size={56} animate={false} />
          </motion.div>

          {OUTCOMES.map((item, i) => {
            const rad = (item.angle * Math.PI) / 180;
            const radius = 160;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const isActive = activeTitle === item.title;
            return (
              <div
                key={item.title}
                className="absolute z-10"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={
                    inView
                      ? {
                          opacity: 1,
                          scale: isActive ? 1.14 : 1,
                          y: isActive ? -3 : 0,
                        }
                      : {}
                  }
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.35 }}
                  onMouseEnter={() => setHover(item.title)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(item.title)}
                  onBlur={() => setHover(null)}
                  className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[11px] font-bold transition-colors sm:px-4 sm:text-sm ${
                    isActive
                      ? "border-assis-blue bg-assis-blue text-white shadow-[0_12px_28px_-10px_rgba(29,111,238,0.65)]"
                      : "border-zinc-200 bg-white/95 text-foreground shadow-sm"
                  }`}
                >
                  {item.title}
                </motion.button>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-2 flex h-14 max-w-md items-center justify-center sm:h-16">
          <AnimatePresence mode="wait">
            {activeItem && (
              <motion.p
                key={activeItem.title}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.35 }}
                className="text-center text-sm text-muted-foreground sm:text-base"
              >
                {activeItem.desc}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
