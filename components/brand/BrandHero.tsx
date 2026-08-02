"use client";

import { motion } from "framer-motion";
import { BookDemoButton } from "@/components/DemoModal";
import AssisLogo from "@/components/AssisLogo";

const CLIENTS = [
  { name: "SHARP", src: "/brand/sharp-logo.png", height: 22 },
  { name: "Roomi", src: "/brand/roomi-logo.png", height: 40 },
  { name: "WarmIntro", src: "/brand/warmintro-logo.png", height: 36 },
] as const;

export default function BrandHero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[min(92vh,880px)] flex-col justify-center overflow-hidden px-5 pb-16 pt-28 sm:px-10 sm:pb-20 sm:pt-32"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% -10%, rgba(29,111,238,0.14), transparent 60%), radial-gradient(ellipse 50% 40% at 100% 60%, rgba(29,111,238,0.06), transparent 55%), linear-gradient(180deg, #f7f9fc 0%, #ffffff 55%, #f4f7fb 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(9,9,11,0.04) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto w-full max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          <AssisLogo height={28} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="font-display text-[2.35rem] font-bold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-6xl md:text-[4.25rem]"
        >
          Customer relationships,
          <span className="block text-assis-blue">done right.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.16 }}
          className="mt-5 font-display text-lg font-semibold tracking-[-0.02em] text-foreground/80 sm:text-xl"
        >
          One partner. Three ways to grow.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22 }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Assis helps ecommerce brands automate customer conversations, manage
          customer care, and turn every interaction into business growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <BookDemoButton className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full bg-assis-blue px-7 text-sm font-semibold text-white transition hover:bg-assis-blue-deep">
            Book a demo
          </BookDemoButton>
          <a
            href="#ways"
            className="inline-flex h-12 min-w-[160px] items-center justify-center rounded-full border border-border bg-white px-7 text-sm font-semibold text-foreground transition hover:bg-zinc-50"
          >
            See how it works
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="mt-12"
        >
          <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            Trusted by growing ecommerce brands
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {CLIENTS.map((c) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={c.name}
                src={c.src}
                alt={c.name}
                className="w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                style={{ height: c.height }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
