import catalogJson from "@/data/catalog.json";
import collectionsMeta from "@/data/collections-meta.json";
import pagesJson from "@/data/pages.json";

export type CatalogVariant = {
  id: number;
  title: string;
  price: string;
  available: boolean;
  option1: string | null;
  option2: string | null;
  option3: string | null;
};

export type CatalogProduct = {
  id: number;
  handle: string;
  title: string;
  bodyHtml: string;
  productType: string;
  tags: string[];
  vendor: string;
  images: string[];
  options: { name: string; values: string[] }[];
  variants: CatalogVariant[];
  price: string;
  image: string;
};

export type CollectionMeta = {
  handle: string;
  title: string;
  description: string;
};

type CatalogFile = {
  products: CatalogProduct[];
  collections: Record<string, string[]>;
};

const catalog = catalogJson as CatalogFile;
const meta = collectionsMeta as CollectionMeta[];
const pages = pagesJson as Record<string, { title: string; body: string }>;

export function getAllProducts(): CatalogProduct[] {
  return catalog.products;
}

export function getProduct(handle: string): CatalogProduct | undefined {
  return catalog.products.find((p) => p.handle === handle);
}

export function getCollectionMeta(handle: string): CollectionMeta | undefined {
  return meta.find((c) => c.handle === handle);
}

export function getAllCollections(): CollectionMeta[] {
  return meta.filter((c) => c.handle !== "frontpage");
}

export function getCollectionProducts(handle: string): CatalogProduct[] {
  const handles = catalog.collections[handle] ?? [];
  const byHandle = new Map(catalog.products.map((p) => [p.handle, p]));
  return handles
    .map((h) => byHandle.get(h))
    .filter((p): p is CatalogProduct => Boolean(p));
}

export function getPage(slug: string) {
  return pages[slug];
}

export function getAllPageSlugs() {
  return Object.keys(pages);
}

export function formatMoney(price: string | number) {
  const n = typeof price === "number" ? price : Number(price);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function stripHtml(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export const NAV = [
  { label: "NEW ARRIVALS", href: "/collections/new-arrivals" },
  {
    label: "SHOP BY CATEGORY",
    href: "/collections/shop-all",
    children: [
      { label: "BRACELETS", href: "/collections/bracelets" },
      { label: "NECKLACES", href: "/collections/necklaces" },
      { label: "SHOP ALL", href: "/collections/shop-all" },
    ],
  },
  {
    label: "SHOP BY DESIGN",
    href: "/collections/shape-edit",
    children: [
      { label: "CLASSIC TENNIS", href: "/collections/signature-pieces" },
      { label: "OMBRE", href: "/collections/ombre" },
      { label: "FANCY SHAPE", href: "/collections/fancy-shapes" },
      { label: "COLORED GEMSTONES", href: "/collections/sapphire" },
      { label: "LAB DIAMOND", href: "/collections/lab-diamonds" },
      { label: "FLEX TENNIS", href: "/collections/flex-tennis" },
    ],
  },
  {
    label: "SHOP BY STONE",
    href: "/pages/gem-ology",
    children: [
      { label: "EMERALD", href: "/collections/emerald" },
      { label: "RUBY", href: "/collections/ruby" },
      { label: "SAPPHIRE", href: "/collections/sapphire" },
      { label: "TOURMALINE", href: "/collections/tourmaline" },
      { label: "SPINEL", href: "/collections/spinel" },
      { label: "LAB DIAMOND", href: "/collections/lab-diamonds" },
      { label: "DIAMONDS", href: "/collections/diamonds" },
    ],
  },
  {
    label: "GEMOLOGY",
    href: "/pages/gem-ology",
    children: [
      { label: "ABOUT GEMS", href: "/pages/gem-ology" },
      { label: "EMERALD", href: "/pages/about-emerald" },
      { label: "RUBY", href: "/pages/about-ruby" },
      { label: "SAPPHIRE", href: "/pages/about-sapphires" },
      { label: "TOURMALINE", href: "/pages/about-tourmaline" },
      { label: "TANZANITE", href: "/pages/about-tanzanite" },
      { label: "TURQUOISE", href: "/pages/about-turquoise" },
      { label: "DIAMOND", href: "/pages/about-diamonds-tennis-club" },
      { label: "LAB DIAMONDS", href: "/pages/about-lab-diamonds" },
      { label: "SPINEL", href: "/pages/about-spinel" },
      { label: "ALL GEM EDUCATION", href: "/pages/gem-ology" },
    ],
  },
] as const;
