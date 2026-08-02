"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { lifestyle } from "@/lib/tennis-club-data";

export default function MadeToOrder() {
  return (
    <section id="made-to-order" className="relative overflow-hidden bg-[#111]">
      <div className="absolute inset-0">
        <Image
          src={lifestyle.madeToOrder}
          alt="Tennis Club jewelry lifestyle"
          fill
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/35" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[520px] max-w-[1100px] flex-col items-start justify-center px-6 py-20 text-white sm:px-10 sm:py-28">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl font-normal tracking-[0.18em] sm:text-4xl sm:tracking-[0.22em]"
        >
          MADE TO ORDER
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="mt-6 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base"
        >
          Tennis Club was created for women who already own the classics and want
          something more personal. Each piece is designed as an alternative to the
          traditional tennis bracelet, reimagined through color, shape, and
          thoughtful design.
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, delay: 0.14 }}
          href="/collections/new-arrivals"
          className="mt-9 inline-flex items-center justify-center border border-white/80 px-7 py-3 text-[11px] font-semibold tracking-[0.2em] transition hover:bg-white hover:text-black"
        >
          SEE WHAT WE&apos;RE WEARING
        </motion.a>

        <div className="mt-14 flex flex-wrap gap-8 text-[11px] tracking-[0.16em] text-white/75 uppercase">
          <p>High quality materials</p>
          <p>Committed to sustainability</p>
        </div>
      </div>
    </section>
  );
}
