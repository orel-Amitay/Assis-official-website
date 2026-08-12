"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BookDemoButton } from "@/components/DemoModal";
import { CHAT_SCENARIOS, HERO_KPIS } from "@/data/base44";
import MaterialIcon from "./MaterialIcon";
import PlatformMarquee from "./PlatformMarquee";
import { scrollToSection } from "./scrollToSection";

export default function Hero() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [step, setStep] = useState(0);
  const scenario = CHAT_SCENARIOS[scenarioIndex];

  useEffect(() => {
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 1400);
    const t2 = setTimeout(() => setStep(2), 2800);
    const t3 = setTimeout(() => setStep(3), 4000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [scenarioIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScenarioIndex((i) => (i + 1) % CHAT_SCENARIOS.length);
    }, 7500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="hero-gradient pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-[hsl(var(--primary)/0.08)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[hsl(var(--primary-container)/0.12)] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-4 pt-8 sm:px-8 sm:pb-6 sm:pt-12 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--primary)/0.18)] bg-white/80 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[hsl(var(--primary))] shadow-sm backdrop-blur-sm"
            >
              <MaterialIcon name="auto_awesome" className="text-[14px]" />
              Built for ecommerce stores
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06 }}
              className="font-headline text-[2.35rem] font-extrabold leading-[1.05] tracking-[-0.045em] text-[hsl(var(--navy-accent))] sm:text-5xl lg:text-[3.5rem]"
            >
              You run the store.
              <br />
              <span className="gradient-blue-text">Assis runs the relationship.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-[hsl(var(--on-surface-variant))] sm:text-lg"
            >
              Before checkout, after shipping, and every chat in between - Assis protects
              revenue so shoppers stay, buy again, and stop becoming tickets.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <BookDemoButton className="inline-flex h-12 items-center justify-center rounded-2xl primary-gradient px-7 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_hsl(var(--primary)/0.65)] transition hover:opacity-90">
                Book a demo
              </BookDemoButton>
              <button
                type="button"
                onClick={() => scrollToSection("packages")}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-[hsl(var(--outline-variant)/0.5)] bg-white/80 px-7 text-sm font-semibold text-[hsl(var(--on-surface))] backdrop-blur-sm transition hover:bg-white"
              >
                See packages
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-3 rounded-[2rem] bg-[hsl(var(--primary)/0.06)] blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 p-4 shadow-[0_30px_80px_-40px_rgba(0,40,120,0.45)] backdrop-blur-md sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.1)] text-sm font-bold text-[hsl(var(--primary))]">
                    SM
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[hsl(var(--on-surface))]">Sarah M.</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--on-surface-variant))]">
                      Active shopping
                    </p>
                  </div>
                </div>
                <span className="rounded-full primary-gradient px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                  High intent
                </span>
              </div>

              <div className="mb-4 flex items-center justify-between rounded-xl bg-[hsl(var(--surface-container-low))] px-3 py-2 text-[11px]">
                <span className="font-medium text-[hsl(var(--on-surface-variant))]">
                  Your store → Assis → Shopper
                </span>
                <span className="flex items-center gap-1 font-semibold text-[hsl(var(--primary))]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>

              <div className="min-h-[210px] space-y-3">
                <AnimatePresence mode="wait">
                  {step >= 1 && (
                    <motion.div
                      key={`assis-${scenarioIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-2.5"
                    >
                      <Image
                        src="/base44/6c78793ff_Assis-HeartLogo.png"
                        alt="Assis"
                        width={28}
                        height={28}
                        unoptimized
                        className="mt-0.5 h-7 w-7 shrink-0"
                      />
                      <div className="rounded-2xl rounded-tl-md bg-[hsl(var(--primary))] px-3.5 py-2.5 text-[13px] leading-relaxed text-white">
                        {scenario.assis.map((seg, i) =>
                          seg.em ? (
                            <span
                              key={i}
                              className="font-semibold underline decoration-white/50 underline-offset-2"
                            >
                              {seg.text}
                            </span>
                          ) : (
                            <span key={i}>{seg.text}</span>
                          ),
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {step >= 2 && (
                    <motion.div
                      key={`customer-${scenarioIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-end"
                    >
                      <div className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-tr-md bg-[hsl(var(--surface-container))] px-3.5 py-2.5 text-[13px] leading-relaxed text-[hsl(var(--on-surface))]">
                        {scenario.customer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {step >= 3 && (
                    <motion.div
                      key={`outcome-${scenarioIndex}`}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center pt-1"
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.08)] px-3.5 py-1.5 text-[11px] font-bold tracking-wider text-[hsl(var(--primary))]">
                        <MaterialIcon name="verified" filled className="text-sm" />
                        {scenario.outcome}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-4 sm:gap-4"
        >
          {HERO_KPIS.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-2xl border border-white/80 bg-white/75 px-4 py-4 shadow-[0_10px_30px_-24px_rgba(0,40,120,0.5)] backdrop-blur-sm sm:px-5 sm:py-5"
            >
              <p className="font-headline text-2xl font-extrabold tracking-tight text-[hsl(var(--primary))] sm:text-3xl">
                {kpi.value}
              </p>
              <p className="mt-1 text-sm font-bold text-[hsl(var(--on-surface))]">{kpi.label}</p>
              <p className="mt-0.5 text-[11px] text-[hsl(var(--on-surface-variant))]">
                {kpi.hint}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.42 }}
        className="relative border-t border-[hsl(var(--outline-variant)/0.2)] bg-[hsl(230_100%_98%)]"
      >
        <PlatformMarquee />
      </motion.div>
    </section>
  );
}
