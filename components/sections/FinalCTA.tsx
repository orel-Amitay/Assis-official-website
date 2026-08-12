"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { BookDemoButton } from "@/components/DemoModal";

const SHOPIFY_APP_URL = "https://apps.shopify.com/assis-care";

const CHATS = [
  {
    className: "left-[6%] top-[16%] w-16 sm:left-[8%] sm:w-20",
    opacity: 0.16,
    delay: "0s",
    motion: "animate-float-slow",
    flip: false,
  },
  {
    className: "right-[7%] top-[20%] w-14 sm:right-[10%] sm:w-16",
    opacity: 0.14,
    delay: "0.5s",
    motion: "animate-float",
    flip: true,
  },
  {
    className: "left-[10%] bottom-[18%] w-12 sm:left-[12%] sm:w-14",
    opacity: 0.12,
    delay: "1.1s",
    motion: "animate-float-alt",
    flip: false,
  },
  {
    className: "right-[12%] bottom-[22%] w-16 sm:right-[14%] sm:w-18",
    opacity: 0.15,
    delay: "0.3s",
    motion: "animate-float-slow",
    flip: true,
  },
  {
    className: "hidden left-[28%] top-[12%] w-10 sm:block",
    opacity: 0.1,
    delay: "1.4s",
    motion: "animate-float",
    flip: false,
  },
  {
    className: "hidden right-[30%] bottom-[14%] w-11 sm:block",
    opacity: 0.11,
    delay: "0.8s",
    motion: "animate-float-alt",
    flip: true,
  },
] as const;

function ChatBubble({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 52"
      fill="currentColor"
      className={`h-auto w-full ${flip ? "-scale-x-100" : ""}`}
      aria-hidden
    >
      <path d="M8 4h40c4.4 0 8 3.6 8 8v20c0 4.4-3.6 8-8 8H28l-10 10v-10H8c-4.4 0-8-3.6-8-8V12c0-4.4 3.6-8 8-8z" />
    </svg>
  );
}

export default function FinalCTA() {
  return (
    <section id="demo" className="relative scroll-mt-20 overflow-hidden px-5 py-16 sm:px-10 sm:py-28">
      <ScrollReveal className="relative mx-auto w-full max-w-4xl">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-assis-blue px-6 py-12 text-center shadow-[0_32px_80px_-40px_rgba(29,111,238,0.55)] sm:rounded-[2rem] sm:px-14 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 80% 70% at 50% -10%, rgba(255,255,255,0.28), transparent 55%), radial-gradient(ellipse 50% 40% at 85% 90%, rgba(15,70,180,0.35), transparent 60%), radial-gradient(ellipse 40% 35% at 10% 85%, rgba(255,255,255,0.12), transparent 55%)",
            }}
          />

          <div className="pointer-events-none absolute inset-0 text-white" aria-hidden>
            {CHATS.map((c, i) => (
              <span
                key={i}
                className={`absolute ${c.motion} ${c.className}`}
                style={{ opacity: c.opacity, animationDelay: c.delay }}
              >
                <ChatBubble flip={c.flip} />
              </span>
            ))}
          </div>

          <div className="relative flex flex-col items-center">
            <h2 className="font-display text-[1.75rem] font-bold leading-[1.1] tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.75rem]">
              Put Assis on the customer side
              <br />
              of your business.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
              More revenue. Fewer refunds. Customers who come back.
            </p>

            <div className="mt-8 flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:mt-9 sm:max-w-none sm:w-auto sm:flex-row sm:items-center">
              <a
                href={SHOPIFY_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-assis-blue shadow-[0_12px_30px_-12px_rgba(255,255,255,0.8)] transition-colors hover:bg-white/95"
              >
                Install on Shopify
              </a>
              <BookDemoButton className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                Book a demo
              </BookDemoButton>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
