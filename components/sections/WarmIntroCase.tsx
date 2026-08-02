"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useScrollPacing } from "@/hooks/useScrollPacing";
import {
  crossfadeVisuals,
  REVEAL_DURATION,
  REVEAL_EASE,
  SCROLL_PROGRESS_TRANSITION,
  SCROLL_STICKY_TOP_CLASS,
  tabProgress,
} from "@/lib/scroll-pacing";

const CHAPTERS = [
  {
    moment: "Convert",
    title: "Trials that would have churned became paying customers",
    summary: "Assis reached users at the trial cliff, uncovered blockers, and converted 64% of those conversations.",
    conversation: [
      {
        sender: "Assis",
        text: "You've been exploring WarmIntro but haven't made your first connection. Is something not clicking?",
        isAI: true,
      },
      {
        sender: "Sarah",
        text: "I wanted investors but didn't think my network was strong enough.",
        isAI: false,
      },
    ],
    outcome: "Paid within 24 hours.",
    stat: "64%",
    statLabel: "trial cliff conversions",
  },
  {
    moment: "Expand",
    title: "Active users upgraded when they hit plan limits",
    summary:
      "Assis spotted power users still on Starter and started expansion conversations. ARPU on expanded accounts up 140%.",
    conversation: [
      {
        sender: "Assis",
        text: "You've been on a roll with intros. Running into limits on your plan?",
        isAI: true,
      },
      {
        sender: "James",
        text: "Hit the cap. Didn't know Premium had unlimited intros.",
        isAI: false,
      },
    ],
    outcome: "Upgraded to Premium same week.",
    stat: "+140%",
    statLabel: "ARPU on expanded accounts",
  },
  {
    moment: "Recover",
    title: "Cancellation requests turned into upgrades",
    summary:
      "Assis intercepted every cancellation and brought in Sephi when a strategic conversation could save the deal.",
    conversation: [
      {
        sender: "Assis",
        text: "What were you hoping to get from WarmIntro that hasn't happened yet?",
        isAI: true,
      },
      {
        sender: "Dana",
        text: "I joined for investors but I'm going in circles.",
        isAI: false,
      },
    ],
    outcome: "3 investor intros in 2 weeks, upgraded to Premium.",
    stat: "1 in 3",
    statLabel: "cancellations became upgrades",
  },
] as const;

type Chapter = (typeof CHAPTERS)[number];

function ChapterPanel({ chapter }: { chapter: Chapter }) {
  return (
    <article
      className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl bg-white sm:min-h-[300px]"
      style={{ boxShadow: "0 4px 32px -8px rgba(29,111,238,0.12)" }}
    >
      <div className="grid flex-1 content-start gap-4 p-4 sm:grid-cols-2 sm:gap-6 sm:p-5">
        <div className="space-y-3">
          <h3 className="font-display text-lg font-bold leading-snug text-foreground sm:text-xl">
            {chapter.title}
          </h3>
          <p className="text-sm leading-relaxed text-zinc-500">{chapter.summary}</p>
          <p className="text-sm font-medium text-zinc-700">{chapter.outcome}</p>
          <div className="pt-1">
            <p className="font-display text-3xl font-bold tracking-tight text-assis-blue">
              {chapter.stat}
            </p>
            <p className="mt-0.5 text-xs text-zinc-400">{chapter.statLabel}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2 rounded-xl p-3" style={{ background: "#f5f7ff" }}>
          {chapter.conversation.map((msg, j) => (
            <div key={j} className={`flex flex-col gap-0.5 ${msg.isAI ? "" : "items-end"}`}>
              <span
                className={`text-[9px] font-bold tracking-wider ${msg.isAI ? "text-assis-blue" : "text-zinc-400"}`}
              >
                {msg.sender}
              </span>
              <div
                className={`max-w-[92%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  msg.isAI ? "bg-white text-zinc-700" : "text-zinc-600"
                }`}
                style={
                  msg.isAI
                    ? { boxShadow: "0 1px 4px rgba(29,111,238,0.08)" }
                    : { background: "rgba(0,0,0,0.05)" }
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function WarmIntroCase() {
  const { containerRef, active, fill, containerStyle } = useScrollPacing();
  const sectionInView = useInView(containerRef, { once: true, amount: 0.08 });

  return (
    <section id="cases" className="scroll-mt-20" style={{ background: "#eef3ff" }}>
      <div ref={containerRef} className="relative" style={containerStyle}>
        <div
          className={`sticky ${SCROLL_STICKY_TOP_CLASS} flex min-h-[calc(100svh-4rem)] items-center px-6 py-5 sm:px-10`}
        >
          <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: REVEAL_DURATION, ease: REVEAL_EASE }}
              className="flex items-center gap-2.5"
            >
              <Image
                src="/brand/warmintro-logo.png"
                alt="WarmIntro"
                width={32}
                height={32}
                className="h-7 w-7"
              />
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-assis-blue/70">
                Case study &middot; WarmIntro
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: REVEAL_DURATION, delay: 0.08, ease: REVEAL_EASE }}
              className="grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10"
            >
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-3xl lg:text-[2.5rem]">
                  3,000+ trials.
                  <br />
                  <span className="text-assis-blue">LTV up 50%.</span>
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-foreground/55 sm:text-[15px]">
                  WarmIntro converted trials, expanded accounts, and turned cancellations into
                  upgrades. Not another AI tool. Measurable revenue.
                </p>
              </div>

              <blockquote className="rounded-2xl border border-assis-blue/15 bg-white/70 px-5 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
                <p className="font-display text-xl font-bold leading-snug tracking-[-0.02em] text-foreground sm:text-2xl">
                  &ldquo;Assis increased our LTV by 50%.&rdquo;
                </p>
                <footer className="mt-2 text-xs text-foreground/55 sm:text-sm">
                  <span className="font-semibold text-foreground">Sephi Shapira</span>
                  <span className="text-foreground/35"> · </span>
                  Founder &amp; CEO, WarmIntro
                </footer>
              </blockquote>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: REVEAL_DURATION, delay: 0.14, ease: REVEAL_EASE }}
              className="flex items-center gap-3"
            >
              {CHAPTERS.map((chapter, i) => {
                const emphasis = crossfadeVisuals(i, fill, CHAPTERS.length).opacity;
                return (
                  <div key={chapter.moment} className="flex flex-1 flex-col gap-1.5">
                    <div className="h-1 overflow-hidden rounded-full bg-white/60">
                      <motion.div
                        className="h-full rounded-full bg-assis-blue"
                        style={{ width: `${tabProgress(i, active, fill)}%` }}
                        transition={SCROLL_PROGRESS_TRANSITION}
                      />
                    </div>
                    <p
                      className="text-[11px] font-semibold transition-all duration-500 sm:text-xs"
                      style={{
                        color:
                          emphasis > 0.55
                            ? "var(--assis-blue)"
                            : emphasis > 0.2
                              ? "rgba(9, 9, 11, 0.5)"
                              : "rgba(9, 9, 11, 0.25)",
                      }}
                    >
                      {chapter.moment}
                    </p>
                  </div>
                );
              })}
            </motion.div>

            <div className="relative">
              {CHAPTERS.map((chapter, i) => {
                const { opacity, y } = crossfadeVisuals(i, fill, CHAPTERS.length);
                return (
                  <div
                    key={chapter.moment}
                    className="absolute inset-x-0 top-0 transition-none"
                    style={{
                      opacity,
                      transform: `translateY(${y}px)`,
                      zIndex: Math.round(opacity * 100),
                      pointerEvents: opacity > 0.5 ? "auto" : "none",
                    }}
                  >
                    <ChapterPanel chapter={chapter} />
                  </div>
                );
              })}
              <div className="pointer-events-none invisible" aria-hidden>
                <ChapterPanel chapter={CHAPTERS[1]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
