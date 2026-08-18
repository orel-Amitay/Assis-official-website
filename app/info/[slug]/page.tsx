import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ConsumerInfoView from "@/components/consumer-info/ConsumerInfoView";
import {
  canonicalConsumerSlug,
  consumerInfoSlugs,
  loadConsumerInfo,
} from "@/lib/consumer-info";

export const revalidate = 60;
export const dynamicParams = true;

type InfoParams = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return consumerInfoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: InfoParams): Promise<Metadata> {
  const { slug } = await params;
  const info = await loadConsumerInfo(slug);
  if (!info) return { title: "Customer information | Assis" };
  const he = info.lang !== "en";
  return {
    title: he ? `${info.storeName} | מידע ללקוחות | Assis` : `${info.storeName} | Customer information | Assis`,
    description: he
      ? `כל המדיניות והמידע ללקוחות של ${info.storeName} — במקום אחד.`
      : `Every customer policy and answer for ${info.storeName} — in one place.`,
  };
}

export default async function ConsumerInfoPage({ params }: InfoParams) {
  const { slug } = await params;
  const canonical = canonicalConsumerSlug(slug);
  if (canonical !== slug) redirect(`/info/${canonical}`);

  const info = await loadConsumerInfo(canonical);
  if (!info) notFound();

  return <ConsumerInfoView info={info} />;
}
