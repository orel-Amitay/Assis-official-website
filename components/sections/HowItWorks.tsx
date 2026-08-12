"use client";

import { motion, useInView } from "framer-motion";
import { Lightbulb, UserCheck, TrendingUp } from "lucide-react";
import { useScrollPacing } from "@/hooks/useScrollPacing";
import { REVEAL_DURATION, REVEAL_EASE, SCROLL_PROGRESS_TRANSITION, SCROLL_STICKY_TOP_CLASS } from "@/lib/scroll-pacing";

const STEPS = [
  {
    num: "01",
    label: "Detect",
    title: "Spot who's about to leave",
    desc: "Trial expiring, no activity. Assis catches the signal before they churn.",
  },
  {
    num: "02",
    label: "Converse",
    title: "Start a real conversation",
    desc: "Not a survey or popup. A personal message that asks why and listens.",
  },
  {
    num: "03",
    label: "Recover",
    title: "Keep, upgrade, or learn",
    desc: "Every conversation ends with a result: retention, expansion, or clarity.",
  },
];

const OUTCOMES = [
  {
    Icon: Lightbulb,
    iconColor: "text-zinc-500",
    activeIconColor: "text-assis-blue",
    title: "Insights",
    frequency: "always",
    desc: "Know why they're leaving, not just that they left.",
  },
  {
    Icon: UserCheck,
    iconColor: "text-zinc-500",
    activeIconColor: "text-assis-blue",
    title: "Retention",
    frequency: "usually",
    desc: "The right offer at the right moment. Most customers stay.",
  },
  {
    Icon: TrendingUp,
    iconColor: "text-zinc-500",
    activeIconColor: "text-emerald-600",
    title: "Upgrade",
    frequency: "best case",
    desc: "Identify expansion opportunities and move them to a higher plan.",
  },
];

export default function HowItWorks() {
  const { containerRef, active: activeStep, fill, containerStyle } = useScrollPacing();

  const sectionInView = useInView(containerRef, { once: true, amount: 0.08 });

  return (
    <section id="how" className="scroll-mt-20 bg-zinc-50">
      <div ref={containerRef} className="relative" style={containerStyle}>
        <div className={`sticky ${SCROLL_STICKY_TOP_CLASS} px-6 pb-16 pt-10 sm:px-10 sm:pt-16`}>
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: REVEAL_DURATION, ease: REVEAL_EASE }}
              className="mb-10 text-center lg:mb-12"
            >
              <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.025em] text-foreground sm:text-5xl">
                Three steps. One goal.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-foreground/50 sm:text-base">
                Scroll to see how Assis moves from signal to saved customer.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: REVEAL_DURATION, delay: 0.1, ease: REVEAL_EASE }}
              className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20"
            >
              {/* Steps - left */}
              <div className="relative">
                <div
                  className="absolute bottom-4 left-[1.15rem] top-4 w-px overflow-hidden bg-zinc-200"
                  aria-hidden
                >
                  <motion.div
                    className="w-full bg-assis-blue"
                    style={{ height: `${fill * 100}%` }}
                    transition={SCROLL_PROGRESS_TRANSITION}
                  />
                </div>

                <div className="space-y-8 sm:space-y-10">
                  {STEPS.map((step, i) => {
                    const isActive = i === activeStep;
                    const isDone = i < activeStep;

                    return (
                      <motion.div
                        key={step.num}
                        animate={{ opacity: isActive ? 1 : isDone ? 0.55 : 0.28 }}
                        transition={{ duration: 0.35 }}
                        className="relative flex gap-5 sm:gap-6"
                      >
                        <div
                          className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 sm:h-10 sm:w-10 ${
                            isActive || isDone
                              ? "bg-assis-blue text-white shadow-[0_4px_14px_-4px_rgba(29,111,238,0.55)]"
                              : "bg-white text-assis-blue ring-2 ring-zinc-200"
                          }`}
                        >
                          {step.num}
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p
                            className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                              isActive ? "text-assis-blue" : "text-foreground/35"
                            }`}
                          >
                            {step.label}
                          </p>
                          <h3
                            className={`font-display mt-1 text-xl font-bold leading-snug transition-colors sm:text-2xl ${
                              isActive ? "text-foreground" : "text-foreground/70"
                            }`}
                          >
                            {step.title}
                          </h3>
                          <p
                            className={`mt-2 text-base leading-relaxed transition-colors ${
                              isActive ? "text-foreground/60" : "text-foreground/40"
                            }`}
                          >
                            {step.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Outcomes - right, paired with steps */}
              <div className="relative lg:pt-2">
                <p className="mb-6 text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Every conversation leads to
                </p>
                <div className="space-y-10 sm:space-y-12">
                  {OUTCOMES.map((outcome, i) => {
                    const isActive = i === activeStep;
                    const isDone = i < activeStep;

                    return (
                      <motion.div
                        key={outcome.title}
                        animate={{
                          opacity: isActive ? 1 : isDone ? 0.7 : 0.25,
                          x: isActive ? 0 : isDone ? 0 : 8,
                        }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-start gap-4"
                      >
                        <motion.div
                          animate={{ scale: isActive ? 1.1 : 1 }}
                          transition={{ duration: 0.35 }}
                        >
                          <outcome.Icon
                            className={`h-6 w-6 shrink-0 transition-colors duration-300 ${
                              isActive || isDone ? outcome.activeIconColor : outcome.iconColor
                            }`}
                            strokeWidth={isActive ? 2 : 1.5}
                          />
                        </motion.div>
                        <div className="min-w-0">
                          <p
                            className={`font-display text-lg font-bold transition-colors sm:text-xl ${
                              isActive ? "text-foreground" : "text-foreground/50"
                            }`}
                          >
                            {outcome.title}
                            <span
                              className={`ml-2 text-xs font-medium transition-colors ${
                                isActive ? "text-assis-blue" : "text-foreground/30"
                              }`}
                            >
                              · {outcome.frequency}
                            </span>
                          </p>
                          <p
                            className={`mt-1 text-sm leading-relaxed transition-colors sm:text-base ${
                              isActive ? "text-foreground/60" : "text-foreground/35"
                            }`}
                          >
                            {outcome.desc}
                          </p>
                          {isActive && (
                            <motion.div
                              layoutId="outcome-indicator"
                              className="mt-3 h-0.5 w-12 rounded-full bg-assis-blue"
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
