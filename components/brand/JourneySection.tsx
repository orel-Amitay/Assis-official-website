"use client";

import { Lightbulb, ShoppingCart, Truck, type LucideIcon } from "lucide-react";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

const MOMENTS: {
  stage: string;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
  icon: LucideIcon;
  points: string[];
}[] = [
  {
    stage: "Before purchase",
    title: "Help shoppers buy with confidence.",
    body: "Product questions, size & fit, shipping, and return fears get answered before the cart is abandoned.",
    metric: "43%",
    metricLabel: "Conversion rate",
    icon: ShoppingCart,
    points: ["Product Q&A", "Size, fit & policy", "Checkout confidence"],
  },
  {
    stage: "After purchase",
    title: "Protect trust after every order.",
    body: "Refunds turn into exchanges. Issues get solved. The shopper stays — and so does the revenue.",
    metric: "93%",
    metricLabel: "Of at-risk revenue kept",
    icon: Truck,
    points: ["Exchanges over refunds", "WISMO & order issues", "Service that rates 4.9"],
  },
  {
    stage: "Business growth",
    title: "Discover what customers are trying to tell you.",
    body: "Across chats, patterns show what to restock, what to list, and what frustrates people.",
    metric: "LTV ↑",
    metricLabel: "Customer lifetime value",
    icon: Lightbulb,
    points: ["What shoppers ask for", "Where ops break", "Reports on Growth"],
  },
];

const CHANNELS = [
  { label: "WhatsApp", iconSrc: "/brand/channel-whatsapp.svg" },
  { label: "iMessage", iconSrc: "/brand/channel-imessage.svg" },
  { label: "Messenger", iconSrc: "/brand/channel-messenger.svg" },
  { label: "Website", iconSrc: "/brand/channel-website.svg" },
  { label: "Email", iconSrc: "/brand/channel-email.svg" },
  { label: "Instagram", iconSrc: "/brand/channel-instagram.svg" },
] as const;

export default function JourneySection() {
  return (
    <section id="journey" className="px-5 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-assis-blue">
            Customer journey
          </p>
          <h2 className="font-display mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
            One customer journey.
            <span className="block">Three ways Assis helps.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mt-10 flex flex-wrap items-center justify-center gap-5">
          {CHANNELS.map((c) => (
            <div key={c.label} className="flex items-center gap-2 opacity-70">
              <Image
                src={c.iconSrc}
                alt={c.label}
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
              <span className="text-xs font-medium text-muted-foreground">{c.label}</span>
            </div>
          ))}
        </ScrollReveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {MOMENTS.map((moment, i) => {
            const Icon = moment.icon;
            return (
              <ScrollReveal key={moment.stage} delay={0.08 * i}>
                <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-white/90">
                  <div className="border-b border-border/70 px-6 py-6">
                    <Icon
                      className="mb-3 h-6 w-6 text-assis-blue/70"
                      strokeWidth={1.6}
                    />
                    <p className="font-display text-4xl font-bold tracking-[-0.05em] text-assis-blue">
                      {moment.metric}
                    </p>
                    <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                      {moment.metricLabel}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col px-6 py-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-assis-blue">
                      {String(i + 1).padStart(2, "0")} · {moment.stage}
                    </p>
                    <h3 className="font-display mt-3 text-xl font-bold tracking-[-0.03em]">
                      {moment.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {moment.body}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {moment.points.map((p) => (
                        <li
                          key={p}
                          className="rounded-full border border-border bg-[#f7f8fa] px-3 py-1 text-[11px] font-medium text-zinc-600"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
