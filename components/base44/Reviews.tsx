"use client";

import MaterialIcon from "./MaterialIcon";
import { SHOPPER_REVIEWS } from "@/data/base44";

const doubled = [...SHOPPER_REVIEWS, ...SHOPPER_REVIEWS];

export default function Reviews() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-14">
      <div className="mx-auto mb-8 max-w-6xl px-5 text-center sm:px-8 lg:px-10">
        <div className="flex items-center justify-center gap-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <MaterialIcon
                key={i}
                name="star"
                filled
                className="text-lg text-amber-400"
              />
            ))}
          </div>
          <p className="font-headline text-sm font-semibold text-[hsl(var(--on-surface))] sm:text-base">
            Loved by 15,000+ shoppers
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[hsl(230_100%_98%)] to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[hsl(230_100%_98%)] to-transparent sm:w-24" />

        <div className="animate-marquee flex w-max gap-4 px-4">
          {doubled.map((review, i) => (
            <article
              key={`${review.name}-${i}`}
              className="glass-card w-[300px] shrink-0 rounded-2xl p-5 sm:w-[340px]"
            >
              <p className="font-serif text-[15px] italic leading-relaxed text-[hsl(var(--on-surface))]">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--primary-container))] text-xs font-bold text-[hsl(var(--on-primary-container))]">
                  {review.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[hsl(var(--on-surface))]">{review.name}</p>
                  <p className="flex items-center gap-1 text-xs text-[hsl(var(--on-surface-variant))]">
                    <MaterialIcon name="verified" filled className="text-sm text-[hsl(var(--primary))]" />
                    Verified shopper
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
