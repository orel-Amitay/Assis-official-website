"use client";

import { Check, Headset, Shield, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { BookDemoButton } from "@/components/DemoModal";

const PLANS = [
  {
    id: "powered",
    name: "Powered by Assis",
    badge: "Self-serve",
    recommended: false,
    icon: Shield,
    tagline: "You manage service. We provide the AI.",
    body: "For stores that want Assis AI and inbox, while their own team stays in control.",
    includesLabel: "Includes",
    includes: [
      "AI customer service",
      "Omnichannel inbox",
      "Pre-purchase & post-purchase chats",
      "Your team handles escalations",
      "Works where your store already lives",
    ],
    pricingNote: "Simple monthly plan",
  },
  {
    id: "care",
    name: "Care by Assis",
    badge: "Recommended",
    recommended: true,
    icon: Headset,
    tagline: "We run customer service for you.",
    body: "Same AI. Our Care team owns the conversations so shoppers feel looked after and your store keeps selling.",
    includesLabel: "Everything in Powered, plus",
    includes: [
      "Dedicated Assis Care team",
      "AI + human collaboration",
      "End-to-end conversation ownership",
      "Escalations handled by Assis",
      "Service that still feels like your brand",
    ],
    pricingNote: "Priced by conversation volume",
  },
  {
    id: "growth",
    name: "Growth by Assis",
    badge: "Business layer",
    recommended: false,
    icon: TrendingUp,
    tagline: "Care, plus insights from every chat.",
    body: "We turn your customer service system into a growth engine: reports, patterns, and a monthly review with your team.",
    includesLabel: "Everything in Care, plus",
    includes: [
      "Monthly strategy meeting",
      "Reports pulled from live conversations",
      "Product & ops signals from chats",
      "What to restock, list, or fix",
      "Business reviews tied to store goals",
    ],
    pricingNote: "Custom for your store",
  },
] as const;

export default function ServiceModels() {
  return (
    <section id="plans" className="scroll-mt-20 px-5 py-16 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            Plans
          </p>
          <h2 className="mt-4 font-display text-center text-[1.75rem] font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
            Three ways to work with Assis.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-[15px] leading-relaxed text-zinc-500 sm:text-base">
            Same AI. Different level of ownership. Pick Powered if your team runs service, Care if
            you want Assis to run it, Growth if you also want the business layer on top.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <ScrollReveal key={plan.id} delay={0.06 * i}>
                <article
                  className={`relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border bg-white p-6 sm:p-7 ${
                    plan.recommended
                      ? "border-assis-blue shadow-[0_24px_60px_-40px_rgba(29,111,238,0.45)] ring-1 ring-assis-blue/20"
                      : "border-zinc-200/80 shadow-[0_16px_40px_-36px_rgba(15,23,42,0.25)]"
                  }`}
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        plan.recommended
                          ? "bg-assis-blue text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                        plan.recommended
                          ? "bg-assis-blue text-white"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold tracking-[-0.03em] text-foreground sm:text-[1.35rem]">
                    {plan.name}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-foreground/80">{plan.tagline}</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{plan.body}</p>

                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    {plan.includesLabel}
                  </p>
                  <ul className="mt-3 flex-1 space-y-2.5">
                    {plan.includes.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-zinc-600">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-assis-blue"
                          strokeWidth={2.5}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 border-t border-zinc-100 pt-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                      Pricing
                    </p>
                    <p className="mt-2 text-sm font-medium text-foreground">{plan.pricingNote}</p>
                    <BookDemoButton
                      className={`mt-4 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                        plan.recommended
                          ? "bg-assis-blue text-white hover:bg-assis-blue-deep"
                          : "border border-zinc-200 bg-white text-foreground hover:bg-zinc-50"
                      }`}
                    >
                      Book a demo
                    </BookDemoButton>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-zinc-400">
          No lock-in. We’ll map the right plan to your store on the demo.
        </p>
      </div>
    </section>
  );
}
