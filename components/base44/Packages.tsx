"use client";

import Image from "next/image";
import { BookDemoButton } from "@/components/DemoModal";

const CHANNELS = [
  { src: "/brand/channel-whatsapp.svg", label: "WhatsApp" },
  { src: "/brand/channel-instagram.svg", label: "Instagram" },
  { src: "/brand/channel-messenger.svg", label: "Messenger" },
  { src: "/brand/channel-email.svg", label: "Email" },
] as const;

type Way = {
  id: string;
  verb: string;
  name: string;
  headline: string;
  body: string;
  points: string[];
  visual: "powered" | "trusted" | "grow";
  featured: boolean;
};

const WAYS: Way[] = [
  {
    id: "powered",
    verb: "We automate.",
    name: "Powered by Assis",
    headline: "AI that never leaves a customer waiting.",
    body: "Perfect for brands that want to automate customer conversations while keeping their own support team.",
    points: [
      "AI across every channel",
      "Instant answers",
      "Human handoff",
      "Self managed",
      "Live in days",
    ],
    visual: "powered",
    featured: false,
  },
  {
    id: "trusted",
    verb: "We operate.",
    name: "Trusted by Assis",
    headline: "We become your customer care team.",
    body: "For brands that want to stop managing support and start focusing on growth.",
    points: [
      "Everything in Powered",
      "Human support specialists",
      "Daily operations",
      "SLA management",
      "Fully managed",
    ],
    visual: "trusted",
    featured: true,
  },
  {
    id: "grow",
    verb: "We optimize.",
    name: "Grow by Assis",
    headline: "Turn conversations into revenue.",
    body: "Every customer interaction becomes insight. Every insight becomes action.",
    points: [
      "Business insights",
      "Conversion opportunities",
      "Product feedback",
      "Customer trends",
      "Executive reports",
    ],
    visual: "grow",
    featured: false,
  },
];

function PoweredVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-[#f5f8ff] p-4">
      <div className="mb-3 flex items-center gap-2">
        {CHANNELS.map((c) => (
          <Image
            key={c.label}
            src={c.src}
            alt={c.label}
            width={18}
            height={18}
            className="h-[18px] w-[18px] object-contain opacity-70"
          />
        ))}
      </div>
      <div className="space-y-2">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-white px-3 py-2 text-[11px] leading-snug text-zinc-600 shadow-sm">
          Do you ship to NYC same day?
        </div>
        <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-assis-blue px-3 py-2 text-[11px] leading-snug text-white">
          Yes — same-day shipping until 2pm. Want me to check stock for your size?
        </div>
        <div className="flex items-center gap-1.5 pt-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[10px] font-medium text-zinc-400">
            Instant · across every channel
          </span>
        </div>
      </div>
    </div>
  );
}

function TrustedVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-[#f5f8ff]">
      <div className="relative h-28">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/roomi-store.png"
          alt="Assis-managed customer care"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/70 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
            Fully managed
          </p>
          <p className="text-sm font-semibold text-white">Your care team, on Assis</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-px bg-border/60">
        {[
          { v: "24/7", l: "Coverage" },
          { v: "SLA", l: "Owned" },
          { v: "4.9", l: "Rating" },
        ].map((s) => (
          <div key={s.l} className="bg-white px-2 py-2.5 text-center">
            <p className="font-headline text-sm font-bold text-assis-blue">{s.v}</p>
            <p className="text-[9px] font-medium uppercase tracking-wider text-zinc-400">
              {s.l}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-[#f5f8ff] p-4">
      <div className="mb-3 flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/sharp-logo.png"
          alt="SHARP"
          className="h-4 w-auto object-contain opacity-80"
        />
        <span className="text-[10px] font-medium text-zinc-400">Product signal</span>
      </div>
      <div className="space-y-2">
        {["Do you sell this?", "Can I order this from you?", "Why don't you carry it?"].map(
          (q, i) => (
            <div
              key={q}
              className="rounded-xl border border-white bg-white/90 px-3 py-2 text-[11px] text-zinc-600 shadow-sm"
              style={{ opacity: 1 - i * 0.15 }}
            >
              &ldquo;{q}&rdquo;
            </div>
          ),
        )}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-assis-blue px-3 py-2 text-white">
        <span className="text-[11px] font-semibold">Pattern → new SKU</span>
        <span className="font-headline text-sm font-bold">43%</span>
      </div>
    </div>
  );
}

function WayVisual({ type }: { type: "powered" | "trusted" | "grow" }) {
  if (type === "powered") return <PoweredVisual />;
  if (type === "trusted") return <TrustedVisual />;
  return <GrowVisual />;
}

export default function Packages() {
  return (
    <section id="packages" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
            Powered. Trusted. Grow.
          </p>
          <h2 className="font-headline mt-4 text-3xl font-bold tracking-[-0.04em] text-[hsl(var(--on-surface))] sm:text-5xl">
            Choose how you want to work with Assis.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[hsl(var(--on-surface-variant))] sm:text-lg">
            Not every brand needs the same level of support.
            <br />
            Start where you are today. Grow whenever you&apos;re ready.
          </p>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {WAYS.map((way) => (
            <article
              key={way.id}
              id={way.id}
              className={`relative flex h-full flex-col rounded-3xl p-6 sm:p-7 ${
                way.featured
                  ? "glass-card border-2 border-[hsl(var(--primary))] shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.25)] ring-1 ring-[hsl(var(--primary)/0.2)]"
                  : "glass-card border border-[hsl(var(--outline-variant)/0.15)]"
              }`}
            >
              {way.featured && (
                <span className="absolute -top-3 left-6 rounded-full bg-[hsl(var(--primary))] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Most stores start here
                </span>
              )}
              <WayVisual type={way.visual} />
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--primary))]">
                {way.verb}
              </p>
              <h3 className="font-headline mt-2 text-2xl font-bold tracking-[-0.03em] text-[hsl(var(--on-surface))]">
                {way.name}
              </h3>
              <p className="mt-2 text-base font-semibold leading-snug tracking-[-0.02em] text-[hsl(var(--on-surface))]">
                {way.headline}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--on-surface-variant))]">
                {way.body}
              </p>
              <ul className="mt-5 flex-1 space-y-2">
                {way.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-[hsl(var(--on-surface))]/80"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--primary))]"
                      aria-hidden
                    />
                    {point}
                  </li>
                ))}
              </ul>
              <BookDemoButton className="mt-6 inline-flex text-left text-sm font-semibold text-[hsl(var(--primary))] transition hover:text-[hsl(var(--primary-container))]">
                Learn more →
              </BookDemoButton>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <BookDemoButton className="primary-gradient inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-lg transition hover:opacity-90">
            Book a demo
          </BookDemoButton>
        </div>
      </div>
    </section>
  );
}
