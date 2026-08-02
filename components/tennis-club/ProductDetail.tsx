"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  formatMoney,
  stripHtml,
  type CatalogProduct,
} from "@/lib/catalog";
import { useCart } from "./CartProvider";

export default function ProductDetail({ product }: { product: CatalogProduct }) {
  const { addItem } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [optionValues, setOptionValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const opt of product.options) {
      if (opt.name !== "Title") init[opt.name] = opt.values[0];
    }
    return init;
  });

  const selectedVariant = useMemo(() => {
    const values = Object.values(optionValues);
    if (values.length === 0) return product.variants[0];
    return (
      product.variants.find((v) => {
        const opts = [v.option1, v.option2, v.option3].filter(Boolean);
        return values.every((val, i) => opts[i] === val);
      }) ?? product.variants[0]
    );
  }, [optionValues, product.variants]);

  const description = stripHtml(product.bodyHtml);
  const images = product.images.length ? product.images : [product.image].filter(Boolean);
  const activeImage = images[imageIndex] ?? images[0];

  return (
    <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-14">
      <div>
        <div className="relative aspect-square overflow-hidden bg-stone">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : null}
        </div>
        {images.length > 1 ? (
          <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setImageIndex(i)}
                className={`relative aspect-square overflow-hidden bg-stone ${
                  i === imageIndex ? "ring-1 ring-foreground" : "opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <p className="text-[11px] tracking-[0.18em] text-muted">
          <Link href="/collections/shop-all" className="hover:text-foreground">
            SHOP ALL
          </Link>
        </p>
        <h1 className="font-display mt-3 text-2xl font-medium tracking-wide sm:text-3xl">
          {product.title}
        </h1>
        <p className="mt-3 text-lg">{formatMoney(selectedVariant?.price ?? product.price)}</p>
        <p className="mt-2 text-xs tracking-[0.12em] text-muted">
          Made to order · Please allow 2–3 weeks
        </p>

        <div className="mt-8 space-y-5">
          {product.options
            .filter((o) => o.name !== "Title")
            .map((opt) => (
              <div key={opt.name}>
                <label className="mb-2 block text-[11px] font-semibold tracking-[0.16em]">
                  {opt.name.toUpperCase()}
                </label>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((val) => {
                    const active = optionValues[opt.name] === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() =>
                          setOptionValues((prev) => ({ ...prev, [opt.name]: val }))
                        }
                        className={`border px-3 py-2 text-xs tracking-wide transition ${
                          active
                            ? "border-foreground bg-foreground text-white"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        <button
          type="button"
          disabled={!selectedVariant}
          onClick={() => {
            if (!selectedVariant) return;
            addItem({
              productHandle: product.handle,
              title: product.title,
              image: product.image,
              price: selectedVariant.price,
              variantId: selectedVariant.id,
              variantTitle: selectedVariant.title,
            });
          }}
          className="mt-8 w-full bg-foreground py-4 text-[11px] font-semibold tracking-[0.2em] text-white transition hover:bg-sage disabled:opacity-40 sm:w-auto sm:min-w-[240px]"
        >
          ADD TO CART
        </button>

        {description ? (
          <div className="mt-10 space-y-4 border-t border-border pt-8 text-sm leading-relaxed text-muted whitespace-pre-line">
            {description}
          </div>
        ) : null}

        <div className="mt-8 space-y-2 text-sm text-muted">
          <p>
            Questions?{" "}
            <Link href="/pages/customer-service" className="text-foreground underline">
              Customer Service
            </Link>
          </p>
          <p>
            <Link href="/pages/return-policy" className="underline">
              Returns & Exchanges
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
