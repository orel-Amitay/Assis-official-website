import Image from "next/image";
import MaterialIcon from "./MaterialIcon";
import { MERCHANT_STORIES } from "@/data/base44";

const SHOPIFY_APP_URL = "https://apps.shopify.com/assis-care";

export default function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
              Case studies
            </p>
            <h2 className="mt-3 font-headline text-3xl font-bold tracking-tight text-[hsl(var(--on-surface))] sm:text-4xl md:text-5xl">
              Real results from real merchants.
            </h2>
          </div>
          <a
            href={SHOPIFY_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-white px-4 py-2 shadow-sm transition-shadow hover:shadow-md"
          >
            <MaterialIcon name="shopping_bag" className="text-lg text-[hsl(var(--primary))]" />
            <span className="text-xs font-bold text-[hsl(var(--on-surface))]">
              Download Shopify App
            </span>
            <MaterialIcon name="arrow_forward" className="text-sm text-[hsl(var(--on-surface-variant))]" />
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {MERCHANT_STORIES.map((story) => (
            <article
              key={story.name}
              className="glass-card flex h-full flex-col overflow-hidden rounded-3xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={story.image}
                  alt={story.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={story.logo}
                    alt=""
                    className="w-auto object-contain"
                    style={{ height: story.logoHeight }}
                  />
                  <span
                    className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${story.categoryColor}`}
                  >
                    {story.category}
                  </span>
                </div>

                {"highlight" in story && story.highlight && (
                  <p className="mt-4 font-headline text-lg font-bold tracking-tight text-[hsl(var(--primary))]">
                    {story.highlight}
                  </p>
                )}

                <p className="mt-4 flex-1 font-serif text-[15px] italic leading-relaxed text-[hsl(var(--on-surface))]">
                  &ldquo;{story.quote}&rdquo;
                </p>
                <div className="mt-5 border-t border-[hsl(var(--outline-variant)/0.2)] pt-4">
                  <p className="font-headline text-sm font-bold text-[hsl(var(--on-surface))]">
                    {story.name}
                  </p>
                  <p className="text-xs text-[hsl(var(--on-surface-variant))]">{story.title}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
