import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/tennis-club/SiteShell";
import ProductDetail from "@/components/tennis-club/ProductDetail";
import ProductCard from "@/components/tennis-club/ProductCard";
import { getAllProducts, getProduct, stripHtml } from "@/lib/catalog";

type Props = { params: Promise<{ handle: string }> };

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) return { title: "Product | TENNIS CLUB" };
  return {
    title: `${product.title} | TENNIS CLUB`,
    description: stripHtml(product.bodyHtml).slice(0, 160) || product.title,
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();

  const related = getAllProducts()
    .filter((p) => p.handle !== product.handle)
    .slice(0, 4);

  return (
    <SiteShell>
      <ProductDetail product={product} />
      <section className="border-t border-border px-4 py-14 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-display text-xl tracking-[0.2em]">YOU MAY ALSO LIKE</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
