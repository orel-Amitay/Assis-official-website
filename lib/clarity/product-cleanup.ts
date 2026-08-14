import type { TopicId, ScanResult } from "./types";

const REMOVE_FROM_PRODUCTS: TopicId[] = [
  "about",
  "contact",
  "locations",
  "payments",
  "discounts",
  "gift_cards",
  "loyalty",
  "hot_updates",
  "shipping",
  "international",
  "pickup",
  "tracking",
  "returns",
  "exchanges",
  "refunds",
  "cancellations",
  "warranty",
  "courier",
  "stock",
  "order",
  "invoices",
  "defects",
];

export type ProductCleanupItem = {
  url: string;
  title: string;
  path: string;
  remove: { text: string; topicTitle: string; topicTitleHe: string }[];
};

export function productCleanup(result: ScanResult): ProductCleanupItem[] {
  const byUrl = new Map<string, ProductCleanupItem>();

  for (const topic of result.topics) {
    if (!REMOVE_FROM_PRODUCTS.includes(topic.id)) continue;
    for (const claim of topic.claims) {
      for (const source of claim.sources) {
        if (!/\/products\//i.test(source.path)) continue;
        const existing = byUrl.get(source.url) || {
          url: source.url,
          title: source.pageTitle || source.path,
          path: source.path,
          remove: [],
        };
        if (!existing.remove.some((item) => item.text === claim.text)) {
          existing.remove.push({
            text: claim.text,
            topicTitle: topic.title,
            topicTitleHe: topic.titleHe,
          });
        }
        byUrl.set(source.url, existing);
      }
    }
  }

  return [...byUrl.values()].sort((a, b) => b.remove.length - a.remove.length);
}

export function productCleanupText(result: ScanResult, lang: "he" | "en" = "he") {
  const items = productCleanup(result);
  const lines =
    lang === "he"
      ? [`ניקוי מוצרים — ${result.storeName}`, "מחקו מהתיאור את המשפטים האלה. מדיניות עוברת לדף אחד.", ""]
      : [`Product cleanup — ${result.storeName}`, "Delete these sentences from product descriptions. Policy belongs on one page.", ""];

  for (const item of items) {
    lines.push(item.title);
    lines.push(item.url);
    for (const row of item.remove) {
      lines.push(`- [${lang === "he" ? row.topicTitleHe : row.topicTitle}] ${row.text}`);
    }
    lines.push("");
  }

  if (items.length === 0) {
    lines.push(lang === "he" ? "לא מצאנו מדיניות מפוזרת בתיאורי מוצרים." : "No scattered policy text found on product pages.");
  }

  return `${lines.join("\n").trim()}\n`;
}
