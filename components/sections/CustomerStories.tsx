"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

const STORIES = [
  {
    id: "sharp",
    name: "SHARP",
    logo: "/brand/sharp-logo.png",
    logoHeight: 22,
    image: "/brand/sharp-product.png",
    imageAlt: "SHARP air purifier in a living room",
    headline: "43% of sales conversations converted.",
    body: "Questions weren’t treated like tickets. They were managed as moments before a purchase. And when shoppers kept asking for a product SHARP didn’t sell, Assis connected the pattern.",
    outcomes: [
      { value: "43%", label: "Of sales conversations converted" },
      { value: "New SKU", label: "From ask to bestseller" },
    ],
    points: [
      "Sales chats handled as moments before purchase",
      "Repeated questions surfaced a missing product",
      "Assis connected the pattern. SHARP listed it. It sold.",
    ],
    footerLabel: "Two outcomes from the chats",
    quotes: [
      {
        name: "Conversion",
        text: "Questions weren’t treated like tickets. They were managed as moments before a purchase.",
      },
      {
        name: "Product signal",
        text: "Shoppers kept asking for a product SHARP didn’t sell. Assis connected the pattern across chats.",
      },
      {
        name: "Bestseller",
        text: "SHARP added it. What started as a repeated question became a bestseller.",
      },
    ],
  },
  {
    id: "roomi",
    name: "Roomi",
    logo: "/brand/roomi-logo.png",
    logoHeight: 26,
    image: "/brand/roomi-store.png",
    imageAlt: "Roomi mattress in a bedroom showroom setting",
    headline: "Double the sales. Same level of service.",
    body: "Roomi doubled sales in 5 months without breaking service or operations. Reviews open with how they were treated, then the mattress, and repeat buys follow.",
    outcomes: [
      { value: "2×", label: "Sales in 5 months" },
      { value: "4.8", label: "Google rating", stars: true },
    ],
    points: [
      "Scale sales without breaking service or ops",
      "Reviews lead with service, then product",
      "More repeats, more loyalty, higher LTV",
    ],
    footerLabel: "Google reviews · 4.8",
    quotes: [
      {
        name: "Shahar Komar",
        text: "I just have to praise the customer service, which is rare at this level. This alone makes me want to purchase again.",
      },
      {
        name: "Shira Tuvia",
        text: "The best service there is: patient, kind, and attentive. It is important to them that the product fits and the customer is satisfied.",
      },
      {
        name: "Omri Cheika",
        text: "Excellent customer service. This is truly the most comfortable mattress I have ever slept on, and we also bought bedding recently.",
      },
    ],
    googleHref:
      "https://www.google.com/search?q=Roomi+%D7%A8%D7%95%D7%9E%D7%99+%D7%91%D7%99%D7%A7%D7%95%D7%A8%D7%95%D7%AA",
  },
] as const;

function Stars() {
  return (
    <span className="text-[11px] tracking-tight text-[#f4b400]" aria-hidden>
      ★★★★★
    </span>
  );
}

export default function CustomerStories() {
  const [active, setActive] = useState(0);
  const story = STORIES[active];
  const hasGoogle = "googleHref" in story && Boolean(story.googleHref);

  return (
    <section id="cases" className="scroll-mt-20 px-5 py-14 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            Store results
          </p>
          <h2 className="mt-4 font-display text-center text-[1.75rem] font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
            Proof from real stores.
          </h2>
          <p className="mt-4 text-center text-[11px] text-zinc-400">
            Tap a store to switch
          </p>
        </ScrollReveal>

        <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10">
          {STORIES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(i)}
              className={`relative flex h-9 items-center rounded-full px-5 text-xs font-semibold transition-colors sm:h-8 sm:px-4 ${
                i === active
                  ? "bg-assis-blue text-white"
                  : "bg-zinc-100 text-zinc-500 hover:bg-assis-blue/10 hover:text-assis-blue"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="relative mt-8 lg:h-[620px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col overflow-hidden rounded-[1.5rem] border border-white/70 bg-white px-5 pb-6 pt-7 shadow-[0_24px_60px_-40px_rgba(29,111,238,0.28)] sm:rounded-[2rem] sm:px-10 sm:pb-8 sm:pt-10 lg:absolute lg:inset-0"
            >
              <div className="grid min-h-0 flex-1 items-start gap-5 lg:grid-cols-2 lg:gap-10">
                <div className="order-2 min-h-0 lg:order-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${story.logo}?v=3`}
                    alt={story.name}
                    className="mb-1 block w-auto object-contain object-left"
                    style={{ height: story.logoHeight }}
                  />
                  <h3 className="mt-4 font-display text-xl font-bold tracking-[-0.03em] text-foreground sm:text-3xl">
                    {story.headline}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-500 sm:text-[15px]">
                    {story.body}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 sm:gap-x-10 sm:gap-y-2">
                    {story.outcomes.map((o) => (
                      <div key={o.label}>
                        <div className="flex items-baseline gap-2">
                          <p className="font-display text-2xl font-bold tracking-[-0.04em] text-assis-blue sm:text-3xl">
                            {o.value}
                          </p>
                          {"stars" in o && o.stars ? (
                            <span
                              className="text-base tracking-tight text-[#f4b400] sm:text-lg"
                              aria-label="4.8 stars"
                            >
                              ★★★★★
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 max-w-[11rem] text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                          {o.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <ul className="mt-4 space-y-2">
                    {story.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm text-zinc-600">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-assis-blue" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative order-1 h-44 shrink-0 overflow-hidden rounded-2xl sm:h-56 lg:order-2 lg:h-[280px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.image}
                    alt={story.imageAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="mt-6 shrink-0 border-t border-zinc-200/80 pt-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    {story.footerLabel}
                  </p>
                  {hasGoogle ? (
                    <a
                      href={story.googleHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs font-semibold text-assis-blue"
                    >
                      View on Google →
                    </a>
                  ) : null}
                </div>
                <div className="grid gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
                  {story.quotes.map((q) => (
                    <blockquote
                      key={q.text.slice(0, 32)}
                      className="text-[12px] leading-relaxed text-zinc-500 sm:text-[13px]"
                    >
                      {hasGoogle ? <Stars /> : null}
                      <p className={`line-clamp-4${hasGoogle ? " mt-1" : ""}`}>
                        &ldquo;{q.text}&rdquo;
                      </p>
                      {q.name ? (
                        <footer className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                          {q.name}
                        </footer>
                      ) : null}
                    </blockquote>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
