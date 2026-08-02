import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/tennis-club/SiteShell";
import RichText from "@/components/tennis-club/RichText";
import { getPage } from "@/lib/catalog";

const POLICY_SLUGS = [
  "privacy-policy",
  "refund-policy",
  "terms-of-service",
  "contact-information",
] as const;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return POLICY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return { title: "Policy | TENNIS CLUB" };
  return {
    title: `${page.title} | TENNIS CLUB`,
    description: page.body.slice(0, 160).replace(/\n/g, " "),
  };
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  if (!(POLICY_SLUGS as readonly string[]).includes(slug)) notFound();
  const page = getPage(slug);
  if (!page) notFound();

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <h1 className="font-display text-3xl font-medium tracking-[0.18em]">
          {page.title.toUpperCase()}
        </h1>
        <div className="mt-8">
          <RichText body={page.body} />
        </div>
      </article>
    </SiteShell>
  );
}
