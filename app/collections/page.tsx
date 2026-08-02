import Link from "next/link";
import SiteShell from "@/components/tennis-club/SiteShell";
import { getAllCollections, getCollectionProducts } from "@/lib/catalog";

export const metadata = {
  title: "Collections | TENNIS CLUB",
  description: "Shop Tennis Club collections by category, design, and gemstone.",
};

export default function CollectionsIndexPage() {
  const collections = getAllCollections().filter(
    (c) => getCollectionProducts(c.handle).length > 0 || ["shop-all", "bracelets", "necklaces"].includes(c.handle),
  );

  return (
    <SiteShell>
      <section className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:py-16">
        <h1 className="font-display text-center text-3xl tracking-[0.22em]">COLLECTIONS</h1>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {collections.map((c) => {
            const count = getCollectionProducts(c.handle).length;
            return (
              <Link
                key={c.handle}
                href={`/collections/${c.handle}`}
                className="flex items-center justify-between border border-border px-5 py-5 transition hover:bg-stone"
              >
                <div>
                  <p className="text-sm font-medium tracking-[0.14em]">{c.title.toUpperCase()}</p>
                  <p className="mt-1 text-xs text-muted">{count} pieces</p>
                </div>
                <span aria-hidden>→</span>
              </Link>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}
