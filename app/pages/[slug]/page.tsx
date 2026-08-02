import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteShell from "@/components/tennis-club/SiteShell";
import RichText from "@/components/tennis-club/RichText";
import { getAllPageSlugs, getPage } from "@/lib/catalog";

const PAGE_SLUGS = [
  "customer-service",
  "return-policy",
  "contact",
  "gem-ology",
  "data-sharing-opt-out",
  "about-sapphires",
  "about-ruby",
  "about-emerald",
  "about-tourmaline",
  "about-tanzanite",
  "about-turquoise",
  "about-diamonds-tennis-club",
  "about-lab-diamonds",
  "about-spinel",
] as const;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PAGE_SLUGS.filter((slug) => getAllPageSlugs().includes(slug)).map(
    (slug) => ({ slug }),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return { title: "TENNIS CLUB" };
  return {
    title: `${page.title} | TENNIS CLUB`,
    description: page.body.slice(0, 160).replace(/\n/g, " "),
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  if (!(PAGE_SLUGS as readonly string[]).includes(slug)) notFound();
  const page = getPage(slug);
  if (!page) notFound();

  const isGemologyHub = slug === "gem-ology";

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <h1 className="font-display text-3xl font-medium tracking-[0.18em]">
          {page.title.toUpperCase()}
        </h1>
        <div className="mt-8">
          <RichText body={page.body} />
        </div>
        {isGemologyHub ? <GemologyLinks /> : null}
      </article>
    </SiteShell>
  );
}

function GemologyLinks() {
  const gems = [
    { label: "Emerald", href: "/pages/about-emerald" },
    { label: "Ruby", href: "/pages/about-ruby" },
    { label: "Sapphire", href: "/pages/about-sapphires" },
    { label: "Tourmaline", href: "/pages/about-tourmaline" },
    { label: "Tanzanite", href: "/pages/about-tanzanite" },
    { label: "Turquoise", href: "/pages/about-turquoise" },
    { label: "Diamond", href: "/pages/about-diamonds-tennis-club" },
    { label: "Lab Diamonds", href: "/pages/about-lab-diamonds" },
    { label: "Spinel", href: "/pages/about-spinel" },
  ];
  return (
    <div className="mt-12 grid gap-3 sm:grid-cols-2">
      {gems.map((g) => (
        <Link
          key={g.href}
          href={g.href}
          className="flex items-center justify-between border border-border px-4 py-4 text-sm tracking-[0.12em] transition hover:bg-stone"
        >
          <span>{g.label.toUpperCase()}</span>
          <span aria-hidden>→</span>
        </Link>
      ))}
    </div>
  );
}
