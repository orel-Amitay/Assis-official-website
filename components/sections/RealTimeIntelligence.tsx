"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const SCENARIOS = [
  {
    num: "01",
    title: "Wrong size → fixed before delivery",
    desc: "A customer was about to order the wrong size. Assis caught it and corrected it before shipping.",
    icon: "check_circle",
    outcome: "No return. No frustration.",
    visual: "size" as const,
    width: "w-[300px] sm:w-[340px]",
    mt: "",
  },
  {
    num: "02",
    title: "Delivery errors → supplier accountability",
    desc: "Multiple customers received the wrong items. Assis turned the pattern into a clear report the business could act on.",
    icon: "receipt_long",
    outcome: "The business got refunded.",
    visual: "report" as const,
    width: "w-[320px] sm:w-[360px]",
    mt: "sm:mt-10",
  },
  {
    num: "03",
    title: "Pre-order confusion → order optimized",
    desc: "Customers were delaying their own orders without knowing. Assis split shipments in real time.",
    icon: "rocket_launch",
    outcome: "Faster delivery. Fewer complaints.",
    visual: "split" as const,
    width: "w-[300px] sm:w-[340px]",
    mt: "sm:mt-4",
  },
  {
    num: "04",
    title: "Coupon bug → turned into loyalty",
    desc: "A checkout issue was caught in the conversation. Assis fixed it and upgraded the experience.",
    icon: "card_giftcard",
    outcome: "Customer stayed instead of leaving.",
    visual: "coupon" as const,
    width: "w-[310px] sm:w-[350px]",
    mt: "sm:mt-8",
  },
  {
    num: "05",
    title: "Out of stock → recovered revenue",
    desc: "Shoppers who left were remembered. When items returned, Assis brought them back.",
    icon: "trending_up",
    outcome: "Lost demand turned into sales.",
    visual: "stock" as const,
    width: "w-[300px] sm:w-[340px]",
    mt: "sm:mt-12",
  },
  {
    num: "06",
    title: "Delay detected → compensation applied",
    desc: "A shipment delay was spotted early. Assis applied compensation before the customer had to escalate.",
    icon: "verified_user",
    outcome: "Escalations prevented.",
    visual: "delay" as const,
    width: "w-[300px] sm:w-[340px]",
    mt: "sm:mt-6",
  },
] as const;

function MaterialIcon({
  name,
  className = "",
  filled,
}: {
  name: string;
  className?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden
    >
      {name}
    </span>
  );
}

function ScenarioVisual({ type }: { type: (typeof SCENARIOS)[number]["visual"] }) {
  if (type === "size") {
    return (
      <div className="relative flex h-28 items-end justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] px-4 pb-4 pt-5">
        <span className="rounded-lg border border-zinc-200/80 bg-white px-3 py-2 text-xs font-semibold text-zinc-400 line-through">
          M
        </span>
        <span className="rounded-lg bg-assis-blue px-3 py-2 text-xs font-semibold text-white shadow-sm">
          L ✓
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-assis-blue shadow-sm">
          Fixed
        </span>
      </div>
    );
  }

  if (type === "report") {
    return (
      <div className="relative flex h-28 flex-col justify-center gap-1.5 rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] px-5">
        <div className="h-2 w-[72%] rounded-full bg-assis-blue/25" />
        <div className="h-2 w-[58%] rounded-full bg-assis-blue/15" />
        <div className="h-2 w-[65%] rounded-full bg-assis-blue/20" />
        <div className="mt-1 flex gap-1.5">
          <span className="rounded bg-assis-blue px-2 py-0.5 text-[9px] font-bold text-white">
            Pattern
          </span>
          <span className="rounded bg-white px-2 py-0.5 text-[9px] font-bold text-assis-blue shadow-sm">
            Refunded
          </span>
        </div>
      </div>
    );
  }

  if (type === "split") {
    return (
      <div className="grid h-28 grid-cols-2 gap-2 rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] p-3">
        <div className="flex flex-col justify-between rounded-xl bg-white p-2.5 shadow-sm">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Ship A
          </span>
          <span className="text-xs font-semibold text-assis-blue">Today</span>
        </div>
        <div className="flex flex-col justify-between rounded-xl bg-white p-2.5 shadow-sm">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
            Ship B
          </span>
          <span className="text-xs font-semibold text-foreground">Later</span>
        </div>
      </div>
    );
  }

  if (type === "coupon") {
    return (
      <div className="relative flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc]">
        <div className="relative w-[78%] rounded-xl border border-dashed border-assis-blue/40 bg-white px-4 py-3 text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
            Checkout
          </p>
          <p className="mt-1 font-display text-lg font-bold text-assis-blue">VIP +15%</p>
        </div>
      </div>
    );
  }

  if (type === "stock") {
    return (
      <div className="relative flex h-28 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] px-4 pb-3 pt-4">
        <div className="mb-2 flex items-end gap-1.5">
          {[28, 44, 36, 58, 72].map((h, i) => (
            <span
              key={h}
              className="w-5 rounded-t-md bg-assis-blue/20"
              style={{
                height: h,
                background:
                  i === 4
                    ? "var(--assis-blue)"
                    : `rgba(29,111,238,${0.15 + i * 0.08})`,
              }}
            />
          ))}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-assis-blue">
          Back in stock → sold
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-28 items-center gap-3 rounded-2xl bg-gradient-to-br from-[#eef4ff] to-[#f7f9fc] px-4">
      <div className="flex-1 rounded-xl bg-white p-3 shadow-sm">
        <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
          Delay detected
        </p>
        <p className="mt-1 text-xs font-semibold text-foreground">+ credit applied</p>
      </div>
      <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
        Saved
      </span>
    </div>
  );
}

export default function RealTimeIntelligence() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section
      id="intelligence"
      className="scroll-mt-20 overflow-hidden bg-white py-16 sm:py-24"
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-10">
        <ScrollReveal className="mb-12 md:mb-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-assis-blue">
            On the customer side
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-[2rem] font-bold leading-[1.08] tracking-[-0.04em] text-foreground sm:text-5xl">
            Where trust is won
            <span className="mt-1 block text-assis-blue">or quietly lost.</span>
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-500 sm:text-[15px]">
            Real moments from Assis stores. Drag or scroll sideways to move through them.
          </p>
        </ScrollReveal>
      </div>

      <div
        ref={scrollerRef}
        className="flex cursor-grab items-start gap-5 overflow-x-auto px-5 pb-8 active:cursor-grabbing [scrollbar-width:none] sm:gap-6 sm:px-10 lg:px-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        {SCENARIOS.map((scenario, i) => (
          <ScrollReveal key={scenario.num} delay={0.05 * i} className={scenario.mt}>
            <motion.article
              whileHover={{ y: -8, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className={`group relative flex min-h-[400px] shrink-0 flex-col overflow-hidden rounded-[1.75rem] border border-zinc-100 bg-white p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.16)] transition-colors duration-300 hover:border-assis-blue/30 hover:shadow-[0_28px_60px_-30px_rgba(29,111,238,0.45)] sm:min-h-[420px] sm:rounded-[2rem] sm:p-7 ${scenario.width}`}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-assis-blue">
                Scenario {scenario.num}
              </p>
              <h3 className="font-display mt-4 text-[1.15rem] font-bold leading-snug tracking-[-0.03em] text-foreground sm:text-[1.3rem]">
                {scenario.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-zinc-500">
                {scenario.desc}
              </p>

              <div className="mt-5">
                <ScenarioVisual type={scenario.visual} />
              </div>

              <div className="mt-auto flex items-center gap-2.5 border-t border-zinc-100 pt-4">
                <MaterialIcon
                  name={scenario.icon}
                  filled
                  className="text-[22px] text-assis-blue"
                />
                <span className="text-[14px] font-semibold text-foreground">
                  {scenario.outcome}
                </span>
              </div>
            </motion.article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
