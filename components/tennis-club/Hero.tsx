"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { heroImage, heroImageMobile } from "@/lib/tennis-club-data";

export default function Hero() {
  return (
    <section className="relative min-h-[min(88vh,860px)] w-full overflow-hidden bg-[#c4b59a]">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Tennis Club fine jewelry worn on the wrist"
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-center animate-ken-burns sm:block"
        />
        <Image
          src={heroImageMobile}
          alt="Tennis Club fine jewelry"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center animate-ken-burns sm:hidden"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[min(88vh,860px)] max-w-[900px] flex-col items-center justify-end px-6 pb-16 pt-24 text-center text-white sm:pb-20 sm:pt-28">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="font-display max-w-3xl text-[1.55rem] font-light leading-[1.2] tracking-[0.06em] sm:text-4xl md:text-[2.75rem]"
        >
          AN ALTERNATIVE TO THE EXPECTED
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          className="mt-4 max-w-md text-sm leading-relaxed text-white/90 sm:text-base"
        >
          A different kind of tennis bracelet. Designed to be personal.
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.22, ease: "easeOut" }}
          href="/collections/shop-all"
          className="mt-8 inline-flex items-center justify-center border border-white/90 bg-transparent px-8 py-3 text-[11px] font-semibold tracking-[0.2em] text-white transition hover:bg-white hover:text-black"
        >
          EXPLORE TENNIS CLUB
        </motion.a>
      </div>
    </section>
  );
}
