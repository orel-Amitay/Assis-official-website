"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { categories } from "@/lib/tennis-club-data";

export default function CategoryGrid() {
  return (
    <section id="categories" className="bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: i * 0.06 }}
          >
            <Link
              href={cat.href}
              className="group relative block aspect-[4/5] overflow-hidden bg-stone"
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />
              <span className="absolute inset-x-0 bottom-0 p-4 text-center text-[11px] font-semibold tracking-[0.18em] text-white sm:text-xs">
                {cat.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
