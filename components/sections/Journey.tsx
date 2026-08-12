"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Lightbulb,
  ShoppingCart,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useScrollPacing } from "@/hooks/useScrollPacing";
import {
  SCROLL_PROGRESS_TRANSITION,
  SCROLL_STICKY_TOP_CLASS,
  tabProgress,
} from "@/lib/scroll-pacing";
import ScrollReveal from "@/components/ScrollReveal";
import AssisHeartMark from "@/components/AssisHeartMark";
import Ticker from "@/components/Ticker";

const STAGES: {
  id: string;
  label: string;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
  metricNote: string;
  points: string[];
  icon: LucideIcon;
  visual: "checkout" | "refund" | "signal";
}[] = [
  {
    id: "before",
    label: "Before checkout",
    title: "Hesitation becomes a purchase.",
    body: "Customers get clarity on size, shipping, and returns before doubt turns into an abandoned cart.",
    metric: "43%",
    metricLabel: "Conversion rate",
    metricNote: "Average across Assis stores.",
    points: ["Product confidence", "Size, fit & policy", "Checkout clarity"],
    icon: ShoppingCart,
    visual: "checkout",
  },
  {
    id: "after",
    label: "After the order",
    title: "Trust stays. Revenue stays.",
    body: "Delivery anxiety, refunds, and order issues are handled before they become chargebacks, bad reviews, or lost customers.",
    metric: "93%",
    metricLabel: "Of at-risk revenue kept",
    metricNote: "Less money leaving as refunds. More staying as orders.",
    points: ["Exchanges over refunds", "Credit & recovery", "WISMO & order issues"],
    icon: Truck,
    visual: "refund",
  },
  {
    id: "behind",
    label: "Across every touchpoint",
    title: "The business learns what customers need.",
    body: "Demand, friction, and product gaps surface from the customer side - so Grow turns experience into better decisions.",
    metric: "LTV ↑",
    metricLabel: "Customer lifetime value",
    metricNote: "Trust compounds into more repeat orders.",
    points: ["Demand signals", "Ops friction", "Reports on Grow"],
    icon: Lightbulb,
    visual: "signal",
  },
];

function StageVisual({ type }: { type: (typeof STAGES)[number]["visual"] }) {
  if (type === "checkout") {
    return (
      <div className="relative flex h-32 flex-col justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] px-4">
        <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-white px-3 py-2 text-[11px] leading-snug text-zinc-500 shadow-sm">
          Will this fit? Do you ship tomorrow?
        </div>
        <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-assis-blue px-3 py-2 text-[11px] leading-snug text-white">
          Yes - size L in stock. Ships today.
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-assis-blue shadow-sm">
          Bought
        </span>
      </div>
    );
  }

  if (type === "refund") {
    return (
      <div className="grid h-32 grid-cols-2 gap-2 rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] p-3">
        <div className="flex flex-col justify-between rounded-xl bg-white/70 p-2.5 opacity-50">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Refund
          </span>
          <span className="text-xs font-semibold text-zinc-400 line-through">−$128</span>
        </div>
        <div className="flex flex-col justify-between rounded-xl bg-white p-2.5 shadow-sm">
          <span className="text-[9px] font-bold uppercase tracking-wider text-assis-blue">
            Exchange
          </span>
          <span className="text-xs font-semibold text-foreground">Kept in store</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-32 flex-col justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] px-5">
      <div className="h-2 w-[78%] rounded-full bg-assis-blue/25" />
      <div className="h-2 w-[62%] rounded-full bg-assis-blue/15" />
      <div className="h-2 w-[70%] rounded-full bg-assis-blue/20" />
      <div className="mt-1.5 flex gap-1.5">
        <span className="rounded bg-assis-blue px-2 py-0.5 text-[9px] font-bold text-white">
          Ask pattern
        </span>
        <span className="rounded bg-white px-2 py-0.5 text-[9px] font-bold text-assis-blue shadow-sm">
          New SKU
        </span>
      </div>
    </div>
  );
}

const CHANNELS = [
  { label: "WhatsApp", iconSrc: "/brand/channel-whatsapp.svg" },
  { label: "iMessage", iconSrc: "/brand/channel-imessage.svg" },
  { label: "Messenger", iconSrc: "/brand/channel-messenger.svg" },
  { label: "Website", iconSrc: "/brand/channel-website.svg" },
  { label: "Email", iconSrc: "/brand/channel-email.svg" },
  { label: "Instagram", iconSrc: "/brand/channel-instagram.svg" },
] as const;

function StageCard({
  stage,
  className = "",
}: {
  stage: (typeof STAGES)[number];
  className?: string;
}) {
  const StageIcon = stage.icon;

  return (
    <div
      className={`overflow-hidden rounded-[1.5rem] border border-zinc-200/70 bg-white/90 backdrop-blur-sm sm:rounded-[2rem] ${className}`}
    >
      <div className="grid sm:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-center border-b border-zinc-200/70 px-6 py-7 sm:border-b-0 sm:border-r sm:px-11 sm:py-11">
          <div className="mb-4 flex items-center gap-2">
            <StageIcon
              className="h-5 w-5 text-assis-blue/70"
              strokeWidth={1.6}
            />
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              {stage.metricLabel}
            </p>
          </div>
          <StageVisual type={stage.visual} />
          <div className="mt-4 flex items-baseline gap-2">
            <p className="font-display text-2xl font-bold tracking-[-0.04em] text-assis-blue sm:text-3xl">
              {stage.metric}
            </p>
            <p className="text-sm leading-relaxed text-zinc-500">{stage.metricNote}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-7 sm:px-11 sm:py-11">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-assis-blue">
            {stage.label}
          </p>
          <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.03em] text-foreground sm:mt-3 sm:text-3xl">
            {stage.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 sm:mt-4 sm:text-base">
            {stage.body}
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 sm:mt-7">
            {stage.points.map((p) => (
              <li
                key={p}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 sm:px-3.5"
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ChannelsBlock() {
  return (
    <>
      <div className="relative mt-8 overflow-hidden sm:mt-10">
        <Ticker items={CHANNELS} speed="normal" fadeColor="#eef1f5" />
      </div>
      <p className="mt-5 text-center text-[11px] text-zinc-400">
        WhatsApp, email & more · Where your customers already reach you
      </p>
    </>
  );
}

export default function Journey() {
  const { containerRef, active, fill, containerStyle } = useScrollPacing(STAGES.length);
  const [mobileActive, setMobileActive] = useState(0);
  const desktopStage = STAGES[active];
  const mobileStage = STAGES[mobileActive];

  return (
    <section id="journey" className="scroll-mt-20">
      <div className="px-5 pt-16 sm:px-10 sm:pt-28">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
              How it works
            </p>
            <h2 className="mt-4 font-display text-center text-[1.75rem] font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
              One operating layer
              <br />
              across the shopping journey.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-center text-[15px] leading-relaxed text-zinc-500 sm:text-base">
              Before they buy. After they order. And in what those moments teach your business
              next.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="px-5 pt-8 sm:px-10 sm:pt-12">
        <div className="mx-auto flex max-w-md items-center justify-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Your business
          </span>
          <div className="h-px w-8 bg-zinc-300 sm:w-14" />
          <AssisHeartMark size={28} animate={false} glowing={false} />
          <div className="h-px w-8 bg-zinc-300 sm:w-14" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Your customers
          </span>
        </div>
      </div>

      {/* Mobile: stacked tabs with clear tap affordance */}
      <div className="px-5 pb-12 pt-8 sm:hidden">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-2 shadow-sm">
            <p className="px-2 pb-2 pt-1 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              Choose a stage
            </p>
            <div className="flex flex-col gap-1.5">
              {STAGES.map((s, i) => {
                const TabIcon = s.icon;
                const isActive = i === mobileActive;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setMobileActive(i)}
                    aria-pressed={isActive}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all active:scale-[0.99] ${
                      isActive
                        ? "bg-assis-blue text-white shadow-[0_8px_24px_-8px_rgba(29,111,238,0.55)]"
                        : "bg-zinc-50 text-zinc-700 ring-1 ring-inset ring-zinc-200/90"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isActive ? "bg-white/20" : "bg-white"
                      }`}
                    >
                      <TabIcon className="h-4 w-4 shrink-0" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm font-semibold leading-tight">
                      {s.label}
                    </span>
                    {isActive ? (
                      <span className="shrink-0 rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]">
                        Active
                      </span>
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {STAGES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setMobileActive(i)}
                aria-label={s.label}
                className={`h-2 rounded-full transition-all ${
                  i === mobileActive ? "w-6 bg-assis-blue" : "w-2 bg-zinc-300"
                }`}
              />
            ))}
          </div>

          <div className="relative mt-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileStage.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <StageCard stage={mobileStage} />
              </motion.div>
            </AnimatePresence>
          </div>

          <ChannelsBlock />
        </div>
      </div>

      {/* Desktop / tablet: sticky scroll pacing */}
      <div
        ref={containerRef}
        className="relative hidden sm:block"
        style={containerStyle}
      >
        <div
          className={`sticky ${SCROLL_STICKY_TOP_CLASS} px-6 pb-12 pt-10 sm:px-10 sm:pb-14 sm:pt-12`}
        >
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {STAGES.map((s, i) => {
                const TabIcon = s.icon;
                return (
                  <div
                    key={s.id}
                    className={`relative flex items-center gap-1.5 overflow-hidden rounded-full px-4 py-2 text-xs font-semibold sm:text-sm ${
                      i === active
                        ? "bg-assis-blue text-white"
                        : i < active
                          ? "bg-assis-blue/15 text-assis-blue"
                          : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    <TabIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                    {s.label}
                    {i === active ? (
                      <motion.span
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-white/50"
                        style={{
                          width: `${tabProgress(i, active, fill, STAGES.length)}%`,
                        }}
                        transition={SCROLL_PROGRESS_TRANSITION}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-center text-[11px] text-zinc-400">
              Scroll through each stage
            </p>

            <div className="relative mt-8 sm:mt-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={desktopStage.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StageCard stage={desktopStage} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <ChannelsBlock />
        </div>
      </div>
    </section>
  );
}
