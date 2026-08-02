"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { formatUsd, type Product } from "@/lib/tennis-club-data";

type Props = {
  id?: string;
  title: string;
  description: string;
  products: Product[];
};

export default function ProductCarousel({
  id,
  title,
  description,
  products,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-product-card]");
    const amount = card ? card.offsetWidth + 16 : 280;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
    setIndex((prev) => {
      const next = Math.min(Math.max(prev + dir, 0), products.length - 1);
      return next;
    });
  };

  return (
    <section id={id} className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mb-8 max-w-2xl sm:mb-10"
        >
          <h2 className="font-display text-2xl font-medium tracking-[0.2em] sm:text-3xl sm:tracking-[0.28em]">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">
            {description}
          </p>
        </motion.div>

        <div className="relative">
          <div
            ref={scrollerRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
            onScroll={(e) => {
              const el = e.currentTarget;
              const card = el.querySelector<HTMLElement>("[data-product-card]");
              if (!card) return;
              const i = Math.round(el.scrollLeft / (card.offsetWidth + 16));
              setIndex(Math.min(Math.max(i, 0), products.length - 1));
            }}
          >
            {products.map((product, i) => (
              <motion.div
                key={product.handle}
                data-product-card
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.3) }}
                className="w-[72vw] shrink-0 snap-start sm:w-[280px] md:w-[300px]"
              >
                <Link href={`/products/${product.handle}`} className="group block">
                  <div className="relative aspect-square overflow-hidden bg-stone">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="300px"
                      className="object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <h3 className="mt-4 text-[13px] font-medium leading-snug tracking-wide text-foreground">
                    {product.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-muted">
                    {formatUsd(product.price, product.priceFrom)}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs tracking-[0.14em] text-muted">
              {index + 1} / {products.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous products"
                onClick={() => scrollBy(-1)}
                className="inline-flex h-10 w-10 items-center justify-center border border-border text-foreground transition hover:bg-stone"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label="Next products"
                onClick={() => scrollBy(1)}
                className="inline-flex h-10 w-10 items-center justify-center border border-border text-foreground transition hover:bg-stone"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
