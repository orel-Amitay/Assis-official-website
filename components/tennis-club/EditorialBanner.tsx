"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Props = {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  ctaHref?: string;
  ctaLabel?: string;
  reverse?: boolean;
  tone?: "light" | "stone";
};

export default function EditorialBanner({
  title,
  body,
  image,
  imageAlt,
  ctaHref = "/collections/shop-all",
  ctaLabel = "SHOP NOW",
  reverse = false,
  tone = "light",
}: Props) {
  return (
    <section
      className={`overflow-hidden ${tone === "stone" ? "bg-stone" : "bg-white"}`}
    >
      <div
        className={`mx-auto grid max-w-[1400px] items-stretch lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="relative min-h-[360px] sm:min-h-[460px] lg:min-h-[560px]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-6 py-14 sm:px-10 sm:py-16 lg:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6 }}
            className="font-display text-2xl font-normal tracking-[0.12em] text-taupe sm:text-3xl sm:tracking-[0.16em]"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-5 max-w-md text-sm leading-relaxed text-muted sm:text-[15px]"
          >
            {body}
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.55, delay: 0.14 }}
            href={ctaHref}
            className="mt-8 inline-flex w-fit items-center border-b border-foreground pb-1 text-[11px] font-semibold tracking-[0.2em] transition hover:opacity-70"
          >
            {ctaLabel}
          </motion.a>
        </div>
      </div>
    </section>
  );
}
