"use client";

import { useMemo, useState } from "react";
import SiteShell from "@/components/tennis-club/SiteShell";
import ProductCard from "@/components/tennis-club/ProductCard";
import { getAllProducts } from "@/lib/catalog";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const products = useMemo(() => getAllProducts(), []);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 12);
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.productType.toLowerCase().includes(q) ||
        p.handle.includes(q),
    );
  }, [products, query]);

  return (
    <SiteShell>
      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <h1 className="font-display text-2xl tracking-[0.22em]">SEARCH</h1>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bracelets, necklaces, sapphires…"
          className="mt-6 w-full max-w-xl border border-border px-4 py-3 text-sm outline-none focus:border-foreground"
          autoFocus
        />
        <p className="mt-4 text-xs tracking-[0.12em] text-muted">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {results.map((product) => (
            <ProductCard key={product.handle} product={product} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
