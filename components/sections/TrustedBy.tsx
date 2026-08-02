"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const CLIENT_LOGOS = [
  { name: "SHARP", src: "/brand/sharp-logo.png", height: 28 },
  { name: "Roomi", src: "/brand/roomi-logo.png", height: 56 },
  { name: "WarmIntro", src: "/brand/warmintro-logo.png", height: 44 },
] as const;

export default function TrustedBy() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CLIENT_LOGOS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const logo = CLIENT_LOGOS[index];

  return (
    <section className="border-y border-zinc-100 bg-white px-6 py-12 sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-400">
          Trusted by e-commerce brands
        </p>

        <div className="relative flex h-16 w-full items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute flex flex-col items-center gap-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.src}
                alt={logo.name}
                className="w-auto object-contain"
                style={{ height: logo.height }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          {CLIENT_LOGOS.map((item, i) => (
            <button
              key={item.name}
              type="button"
              aria-label={item.name}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-foreground" : "w-1.5 bg-zinc-200 hover:bg-zinc-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
