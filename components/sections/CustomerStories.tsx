"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

type Story = {
  id: string;
  name: string;
  category: string;
  logo: string;
  logoHeight: number;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  headline: string;
  body: string;
  outcomes: { value: string; label: string; stars?: boolean }[];
  points: string[];
  footerLabel: string;
  quotes: { name: string; text: string; role?: string }[];
  googleHref?: string;
};

const STORIES: Story[] = [
  {
    id: "swift",
    name: "Swift",
    category: "Luxury fashion",
    logo: "/brand/swift-logo.png",
    logoHeight: 28,
    image: "/base44/c390269ec_image.png",
    imageAlt: "Swift luxury fashion customer experience",
    imagePosition: "object-[center_28%]",
    headline: "Returns from 6% to 2% in 3 months.",
    body: "Assis ran the customer side for Swift at luxury speed. Patterns in those moments showed why products came back - so the experience improved before returns piled up.",
    outcomes: [
      { value: "6%→2%", label: "Return rate in 3 months" },
      { value: "100%", label: "Customers covered" },
    ],
    points: [
      "Customer side handled across every channel",
      "Return drivers surfaced from real moments",
      "Issues fixed before they became refunds",
    ],
    footerLabel: "Founder",
    quotes: [
      {
        name: "Yovel Golan",
        role: "Founder at Swift",
        text: "In luxury, the experience is everything. Assis makes sure every customer feels known from the first click. That's how you build loyalty.",
      },
    ],
  },
  {
    id: "sharp",
    name: "SHARP",
    category: "Home appliances",
    logo: "/brand/sharp-logo.png",
    logoHeight: 22,
    image: "/brand/sharp-product.png",
    imageAlt: "SHARP air purifier in a living room",
    imagePosition: "object-center",
    headline: "43% of pre-purchase moments converted.",
    body: "Hesitation before checkout was treated as a revenue moment, not a ticket. When shoppers kept asking for a product SHARP didn’t sell, Assis connected the demand - and a new bestseller followed.",
    outcomes: [
      { value: "43%", label: "Of sales moments converted" },
      { value: "New SKU", label: "From demand to bestseller" },
    ],
    points: [
      "Pre-purchase moments protected conversion",
      "Repeated demand surfaced a missing product",
      "Assis connected the signal. SHARP listed it. It sold.",
    ],
    footerLabel: "COO",
    quotes: [
      {
        name: "Eden Bachman",
        role: "COO at SHARP",
        text: "Assis didn’t just answer questions - it showed us what customers were asking for before we even listed it. That signal became one of our bestsellers.",
      },
    ],
  },
  {
    id: "roomi",
    name: "Roomi",
    category: "Sleep & mattresses",
    logo: "/brand/roomi-logo.png",
    logoHeight: 26,
    image: "/brand/roomi-store.png",
    imageAlt: "Roomi mattress in a bedroom showroom setting",
    imagePosition: "object-[center_40%]",
    headline: "Double the sales. Same level of trust.",
    body: "Roomi scaled revenue in 5 months without breaking the customer experience. Reviews still open with how people were treated - then the product - then the next order.",
    outcomes: [
      { value: "2×", label: "Sales in 5 months" },
      { value: "4.8", label: "Google rating", stars: true },
    ],
    points: [
      "Growth without breaking the customer side",
      "Trust led reviews, then product, then repeats",
      "Higher loyalty and lifetime value",
    ],
    footerLabel: "Founder",
    quotes: [
      {
        name: "Bar Cohen",
        role: "Founder at Roomi",
        text: "We doubled sales without breaking the experience. Assis kept every customer taken care of while we grew - and the reviews still lead with how people were treated.",
      },
    ],
    googleHref:
      "https://www.google.com/search?q=Roomi+%D7%A8%D7%95%D7%9E%D7%99+%D7%91%D7%99%D7%A7%D7%95%D7%A8%D7%95%D7%AA",
  },
];

const ROTATE_MS = 7000;

function Stars() {
  return (
    <span className="text-[11px] tracking-tight text-[#f4b400]" aria-hidden>
      ★★★★★
    </span>
  );
}

export default function CustomerStories() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const story = STORIES[active];
  const hasGoogle = Boolean(story.googleHref);
  const singleQuote = story.quotes.length === 1;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % STORIES.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section id="cases" className="scroll-mt-20 px-5 py-14 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            Proof
          </p>
          <h2 className="mt-4 font-display text-center text-[1.75rem] font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
            When the customer side is managed,
            <br className="hidden sm:block" />
            the business grows.
          </h2>
        </ScrollReveal>

        <div
          className="relative mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col overflow-hidden rounded-[1.5rem] border border-white/70 bg-white px-5 pb-6 pt-7 shadow-[0_24px_60px_-40px_rgba(29,111,238,0.28)] sm:rounded-[2rem] sm:px-10 sm:pb-8 sm:pt-10"
            >
              <div className="grid items-stretch gap-5 lg:grid-cols-2 lg:gap-10">
                <div className="order-2 flex min-h-0 flex-col lg:order-1">
                  <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={story.logo}
                      alt={story.name}
                      className="block w-auto object-contain object-left"
                      style={{ height: story.logoHeight }}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                      {story.category}
                    </span>
                  </div>
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
                          {o.stars ? (
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

                <div className="relative order-1 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 sm:aspect-[16/11] lg:order-2 lg:aspect-auto lg:h-full lg:min-h-[20rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.image}
                    alt={story.imageAlt}
                    className={`absolute inset-0 h-full w-full object-cover ${
                      story.imagePosition ?? "object-center"
                    }`}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5"
                    aria-hidden
                  />
                </div>
              </div>

              <div className="mt-6 shrink-0 border-t border-zinc-200/80 pt-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    {story.footerLabel}
                  </p>
                  {hasGoogle && story.googleHref ? (
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
                {singleQuote ? (
                  <blockquote className="max-w-3xl">
                    <p className="font-display text-lg font-medium leading-snug tracking-[-0.02em] text-foreground sm:text-xl">
                      &ldquo;{story.quotes[0].text}&rdquo;
                    </p>
                    <footer className="mt-3 text-sm text-zinc-500">
                      <span className="font-semibold text-foreground">
                        {story.quotes[0].name}
                      </span>
                      {story.quotes[0].role ? (
                        <>
                          <span className="text-zinc-300"> · </span>
                          {story.quotes[0].role}
                        </>
                      ) : null}
                    </footer>
                  </blockquote>
                ) : (
                  <div className="grid gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
                    {story.quotes.map((q) => (
                      <blockquote
                        key={q.text.slice(0, 32)}
                        className="text-[12px] leading-relaxed text-zinc-500 sm:text-[13px]"
                      >
                        {hasGoogle ? <Stars /> : null}
                        <p className={`${hasGoogle ? "mt-1 " : ""}line-clamp-4`}>
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
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="mt-6 flex items-center justify-center gap-1.5"
          role="tablist"
          aria-label="Customer stories"
        >
          {STORIES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${s.name} story`}
              title={s.name}
              onClick={() => setActive(i)}
              className="group flex h-10 cursor-pointer items-center justify-center px-1.5 focus-visible:outline-none"
            >
              <span
                className={`block rounded-full transition-all duration-300 group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-assis-blue/40 group-focus-visible:ring-offset-2 ${
                  i === active
                    ? "h-2.5 w-9 bg-assis-blue"
                    : "h-2.5 w-2.5 bg-zinc-300 group-hover:bg-assis-blue/55 group-hover:w-5"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
