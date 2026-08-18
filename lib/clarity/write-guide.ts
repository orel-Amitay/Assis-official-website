import { SECTION_GUIDE } from "./checklists";
import type { ClarityLang } from "./copy";
import { processHint } from "./process-templates";
import { TOPICS } from "./topics";
import type { CustomQaItem, TopicGroupId, TopicId } from "./types";

export type WriteGuide = {
  why: string;
  bullets: string[];
  example: string;
};

const DETAIL_ALIASES: Array<{ test: RegExp; topicId: TopicId }> = [
  { test: /אודות|about|מי אתם|הסיפור|ביו/i, topicId: "about" },
  { test: /חנות|איסוף|כתובת|סניפ|תצוגה|showroom|pickup|locations/i, topicId: "locations" },
  { test: /תשלום|אשראי|מע["״]מ|payment|פייטר|\bbit\b|ביט/i, topicId: "payments" },
  { test: /משלוח|שליח|אספקה|shipping|delivery|courier/i, topicId: "shipping" },
  { test: /מעקב|tracking/i, topicId: "tracking" },
  { test: /החזר כספ|זיכוי|refund/i, topicId: "refunds" },
  { test: /החלפ|exchange/i, topicId: "exchanges" },
  { test: /החזר|return/i, topicId: "returns" },
  { test: /ביטול|cancel/i, topicId: "cancellations" },
  { test: /פגם|אחריות|warranty|defect/i, topicId: "warranty" },
  { test: /הנח|קופון|מבצע|promo|discount/i, topicId: "discounts" },
  { test: /מועדון|נקודות|loyalty/i, topicId: "loyalty" },
  { test: /גיפט|gift/i, topicId: "gift_cards" },
  { test: /התאמה|custom/i, topicId: "customization" },
  { test: /שעות|וואטסאפ|whatsapp|מענה|שירות לקוחות|contact/i, topicId: "contact" },
  { test: /חשבונית|invoice/i, topicId: "invoices" },
  { test: /משפיענ|influencer/i, topicId: "discounts" },
  { test: /מלאי|stock|preorder/i, topicId: "stock" },
  { test: /הזמנה|order/i, topicId: "order" },
  { test: /דגש|עדכון|hot update/i, topicId: "hot_updates" },
  { test: /מוצר|product/i, topicId: "product_info" },
  { test: /פלטפורמ|אינטגר|shopify|woocommerce/i, topicId: "integrations" },
];

const GROUP_DEFAULT_TOPIC: Partial<Record<TopicGroupId, TopicId>> = {
  brand: "about",
  stores: "locations",
  community: "loyalty",
  gifts: "gift_cards",
  payment: "payments",
  orders: "order",
  delivery: "shipping",
  stock: "stock",
  returns: "returns",
  extra: "contact",
  products: "product_info",
  general: "about",
  warranty: "defects",
  promos: "discounts",
  prebuy: "customization",
  influencers: "discounts",
  service: "contact",
  billing: "invoices",
  integrations: "integrations",
  notes: "hot_updates",
};

export function writeGuideForTopic(topicId: TopicId, lang: ClarityLang): WriteGuide | null {
  const topic = TOPICS.find((row) => row.id === topicId);
  const guide = SECTION_GUIDE[topicId];
  if (!topic && !guide) return null;
  return {
    why: lang === "he" ? topic?.missingHe || guide?.aiWhyHe || "" : topic?.missingEn || guide?.aiWhy || "",
    bullets: lang === "he" ? guide?.writeHe || [] : guide?.write || [],
    example: lang === "he" ? topic?.exampleCanonicalHe || "" : topic?.exampleCanonical || "",
  };
}

export function writeGuideForCustomQa(item: CustomQaItem, lang: ClarityLang): WriteGuide | null {
  const process = processHint(item.id, lang);
  if (process) return process;
  const blob = `${item.detailName || ""} ${item.question || ""}`;
  const alias = DETAIL_ALIASES.find((row) => row.test.test(blob));
  const topicId = alias?.topicId || GROUP_DEFAULT_TOPIC[item.groupId];
  if (topicId) return writeGuideForTopic(topicId, lang);
  const detail = item.detailName?.trim();
  if (!detail) return null;
  return {
    why:
      lang === "he"
        ? `כתבו כאן מה הלקוח והסוכן צריכים לדעת על «${detail}».`
        : `Write what customers and agents need to know about “${detail}”.`,
    bullets:
      lang === "he"
        ? ["העובדה המרכזית במשפט אחד ברור.", "חריגים / מה לא כלול.", "מה הסוכן צריך לשאול אם חסר מידע."]
        : ["The main fact in one clear sentence.", "Exceptions / what’s not included.", "What the agent should ask if something is missing."],
    example: "",
  };
}
