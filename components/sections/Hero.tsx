"use client";

import Image from "next/image";
import { BookDemoButton } from "@/components/DemoModal";

const SCATTER = [
  {
    src: "/brand/shopify.svg",
    label: "Shopify",
    className: "left-[4%] top-[18%] h-7 w-7 sm:left-[8%] sm:top-[22%] sm:h-9 sm:w-9",
    opacity: 0.32,
    motion: "animate-float-slow",
    delay: "0s",
  },
  {
    src: "/brand/woocommerce.svg",
    label: "WooCommerce",
    className: "right-[5%] top-[16%] h-6 w-6 sm:right-[10%] sm:top-[20%] sm:h-8 sm:w-8",
    opacity: 0.28,
    motion: "animate-float",
    delay: "0.4s",
  },
  {
    src: "/brand/ship-ups.svg",
    label: "UPS",
    className: "left-[2%] top-[48%] h-6 w-6 sm:left-[5%] sm:top-[46%] sm:h-8 sm:w-8",
    opacity: 0.26,
    motion: "animate-float-alt",
    delay: "0.8s",
  },
  {
    src: "/brand/ship-fedex.svg",
    label: "FedEx",
    className: "right-[3%] top-[45%] h-5 w-5 sm:right-[6%] sm:top-[44%] sm:h-7 sm:w-7",
    opacity: 0.26,
    motion: "animate-float-slow",
    delay: "1.1s",
  },
  {
    src: "/brand/wix.svg",
    label: "Wix",
    className: "left-[10%] bottom-[14%] h-5 w-5 sm:left-[14%] sm:bottom-[18%] sm:h-7 sm:w-7",
    opacity: 0.24,
    motion: "animate-float",
    delay: "0.2s",
  },
  {
    src: "/brand/ship-dhl.svg",
    label: "DHL",
    className: "right-[8%] bottom-[12%] h-5 w-5 sm:right-[12%] sm:bottom-[16%] sm:h-7 sm:w-7",
    opacity: 0.24,
    motion: "animate-float-alt",
    delay: "1.4s",
  },
  {
    src: "/brand/bigcommerce.svg",
    label: "BigCommerce",
    className: "hidden left-[22%] top-[12%] h-6 w-6 sm:block sm:h-7 sm:w-7",
    opacity: 0.22,
    motion: "animate-float",
    delay: "0.6s",
  },
  {
    src: "/brand/ship-usps.svg",
    label: "USPS",
    className: "hidden right-[22%] top-[11%] h-6 w-6 sm:block sm:h-7 sm:w-7",
    opacity: 0.22,
    motion: "animate-float-slow",
    delay: "1.6s",
  },
  {
    src: "/brand/channel-whatsapp.svg",
    label: "WhatsApp",
    className: "hidden left-[18%] top-[68%] h-6 w-6 sm:block",
    opacity: 0.22,
    motion: "animate-float-alt",
    delay: "0.9s",
  },
  {
    src: "/brand/channel-instagram.svg",
    label: "Instagram",
    className: "hidden right-[16%] top-[66%] h-6 w-6 sm:block",
    opacity: 0.22,
    motion: "animate-float",
    delay: "1.3s",
  },
  {
    src: "/brand/channel-imessage.svg",
    label: "iMessage",
    className: "hidden left-[6%] top-[32%] h-5 w-5 lg:block",
    opacity: 0.2,
    motion: "animate-float-slow",
    delay: "1.8s",
  },
  {
    src: "/brand/channel-messenger.svg",
    label: "Messenger",
    className: "hidden right-[5%] top-[32%] h-5 w-5 lg:block",
    opacity: 0.2,
    motion: "animate-float-alt",
    delay: "0.5s",
  },
  {
    src: "/brand/channel-email.svg",
    label: "Email",
    className: "left-[48%] top-[8%] h-5 w-5 sm:left-[46%] sm:top-[6%] sm:h-6 sm:w-6",
    opacity: 0.18,
    motion: "animate-float",
    delay: "1.2s",
  },
] as const;

function GhostMark({
  src,
  label,
  className,
  opacity,
  motion,
  delay,
}: {
  src: string;
  label: string;
  className: string;
  opacity: number;
  motion: string;
  delay: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`pointer-events-none absolute ${motion} ${className}`}
      style={{ animationDelay: delay }}
    >
      <span
        className="block h-full w-full bg-zinc-400"
        style={{
          opacity,
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    </span>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[min(78svh,720px)] flex-col justify-center overflow-hidden px-5 pb-10 pt-24 sm:min-h-[78svh] sm:px-10 sm:pb-12 sm:pt-32"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {SCATTER.map((item) => (
          <GhostMark key={item.label} {...item} />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <h1 className="font-display text-[2.15rem] font-bold leading-[1.06] tracking-[-0.05em] text-foreground min-[400px]:text-[2.5rem] sm:text-6xl lg:text-[4.75rem]">
          You run the store.
          <br />
          <span className="text-assis-blue">Assis runs the relationship.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-zinc-500 sm:mt-7 sm:text-lg">
          AI between your store and your shoppers. Run it with your team, or let Assis Care run it
          for you.
        </p>

        <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:mt-12 sm:w-auto sm:flex-row sm:items-center">
          <BookDemoButton className="inline-flex h-12 items-center justify-center rounded-full bg-assis-blue px-8 text-sm font-semibold text-white transition-colors hover:bg-assis-blue-deep">
            Book a demo
          </BookDemoButton>
          <a
            href="#journey"
            className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200/80 bg-white/70 px-8 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-white"
          >
            See how it works
          </a>
        </div>

        <div className="mx-auto mt-12 flex w-full max-w-[17rem] items-center justify-center gap-2.5 min-[400px]:max-w-xs sm:mt-16 sm:gap-4">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400 min-[400px]:text-[10px] min-[400px]:tracking-[0.2em]">
            Your store
          </span>
          <div className="h-px flex-1 bg-zinc-200/80" />
          <Image
            src="/brand/assis-heart.png"
            alt="Assis"
            width={32}
            height={31}
            unoptimized
            priority
            className="h-7 w-auto animate-float object-contain sm:h-8"
          />
          <div className="h-px flex-1 bg-zinc-200/80" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400 min-[400px]:text-[10px] min-[400px]:tracking-[0.2em]">
            Your shoppers
          </span>
        </div>
      </div>
    </section>
  );
}
