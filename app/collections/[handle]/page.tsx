import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/tennis-club/SiteShell";
import ProductCard from "@/components/tennis-club/ProductCard";
import {
  getAllCollections,
  getCollectionMeta,
  getCollectionProducts,
} from "@/lib/catalog";

type Props = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return getAllCollections().map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const collection = getCollectionMeta(handle);
  if (!collection) return { title: "Collection | TENNIS CLUB" };
  return {
    title: `${collection.title} | TENNIS CLUB`,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const collection = getCollectionMeta(handle);
  if (!collection) notFound();
  const products = getCollectionProducts(handle);

  return (
    <SiteShell>
      <section className="border-b border-border bg-stone/40 px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[900px] text-center">
          <h1 className="font-display text-3xl font-medium tracking-[0.22em] sm:text-4xl">
            {collection.title.toUpperCase()}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-[15px]">
            {collection.description}
          </p>
          <p className="mt-3 text-xs tracking-[0.14em] text-muted">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        {products.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">
            No products in this collection yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product) => (
              <ProductCard key={product.handle} product={product} />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
