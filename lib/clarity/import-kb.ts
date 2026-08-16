import type { ClarityDraft } from "./draft";
import { canonicalGroupId, KB_TEMPLATE } from "./kb-template";
import type { KnowledgeCategory } from "./review-state";
import { GROUPS } from "./topics";
import { withProcessQas } from "./process-templates";
import type { CustomQaItem, ScanResult, TopicGroupId } from "./types";

const CATEGORY_ALIASES: Record<string, TopicGroupId> = {
  מותג: "brand",
  brand: "brand",
  חנויות: "stores",
  stores: "stores",
  "חבר מועדון, קהילה וניוזלטר": "community",
  "club, community & newsletter": "community",
  "כרטיס מתנה (גיפטקארד) והזמנות מתנה": "gifts",
  "gift cards & gift orders": "gifts",
  תשלום: "payment",
  payment: "payment",
  הזמנות: "orders",
  orders: "orders",
  משלוחים: "delivery",
  shipping: "delivery",
  מלאי: "stock",
  stock: "stock",
  "החלפות / החזרות": "returns",
  "exchanges / returns": "returns",
  "מידע נוסף": "extra",
  "additional info": "extra",
  מוצרים: "products",
  products: "products",
  "שאלות תשובות - מהאתר": "products",
  "site q&a": "products",
  "מידע כללי": "brand",
  "general info": "brand",
  "החלפות החזרות": "returns",
  "returns & exchanges": "returns",
  "פגמים/אחריות": "returns",
  "defects & warranty": "returns",
  "מבצעים הנחות והטבות": "returns",
  "promos & discounts": "returns",
  "מידע נוסף - מוצרים": "products",
  "more product info": "products",
  "מידע על מוצרים": "products",
  "לפני רכישה/מכירה": "products",
  "before purchase": "products",
  "משפיעניות וקודי קופון": "returns",
  "influencers & coupon codes": "returns",
  "דגשים חשובים": "extra",
  "important notes": "extra",
  "שעות פעילות מענה שירות לקוחות וואטסאפ": "extra",
  "support hours": "extra",
  חשבוניות: "payment",
  invoices: "payment",
  "פלטפורמות ואינטגרציות": "extra",
  "platforms & integrations": "extra",
  "שאלות פתוחות": "extra",
  "open questions": "extra",
};

function normalizeName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

const ALIAS_LOOKUP = new Map(
  Object.entries(CATEGORY_ALIASES).map(([name, group]) => [normalizeName(name), group]),
);

function groupFromCategoryName(name: string): TopicGroupId | null {
  const direct = ALIAS_LOOKUP.get(normalizeName(name));
  if (direct) return direct;
  const group = GROUPS.find(
    (item) => normalizeName(item.titleHe) === normalizeName(name) || normalizeName(item.title) === normalizeName(name),
  );
  return group?.id || null;
}

function groupFromProcessText(detailName: string, question: string, answer: string): TopicGroupId {
  const blob = `${detailName} ${question} ${answer}`;
  if (/משלוח|שליח|מעקב|courier|shipping|delivery/i.test(blob)) return "delivery";
  if (/ביטול|cancel/i.test(blob)) return "orders";
  return "returns";
}

function isLegacyProcessesCategory(name: string) {
  const value = normalizeName(name);
  return value === "תהליכים" || value === "service processes";
}

export type KbQaSeed = {
  groupId: TopicGroupId;
  section: "info" | "process";
  detailName: string;
  question: string;
  example: string;
  forCustomers: boolean;
};

export function isKnowledgeBaseJson(value: unknown): value is KnowledgeCategory[] {
  if (!Array.isArray(value) || value.length === 0) return false;
  return value.every(
    (item) =>
      item &&
      typeof item === "object" &&
      typeof (item as KnowledgeCategory).name === "string" &&
      Array.isArray((item as KnowledgeCategory).sections),
  );
}

export function guessStoreFromKbFile(fileName?: string) {
  const base = String(fileName || "")
    .replace(/^.*[/\\]/, "")
    .replace(/^knowledge-base-/i, "")
    .replace(/-\d{4}-\d{2}-\d{2}(?:T[\d-]+)?\.json$/i, "")
    .replace(/\.json$/i, "")
    .trim();
  if (!base) return { storeName: "MRA IL", storeUrl: "https://mra-il.com" };
  const storeName = base
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  const host = base.includes(".") ? base : `${base.replace(/\s+/g, "-")}.com`;
  return { storeName, storeUrl: `https://${host}` };
}

export function kbQaSeeds(categories: KnowledgeCategory[]): KbQaSeed[] {
  const seeds: KbQaSeed[] = [];
  for (const category of categories) {
    const legacyProcess = isLegacyProcessesCategory(category.name);
    const categoryGroup = legacyProcess ? null : groupFromCategoryName(category.name);
    if (!legacyProcess && !categoryGroup) continue;
    for (const section of category.sections || []) {
      const detailName = String(section.detailName || "").trim();
      for (const item of section.detailContent || []) {
        const example = String(item.answer || "").trim();
        const question = String(item.question || "").trim();
        if (!example && !question && !detailName) continue;
        if (!question && !detailName) continue;
        const forCustomers = item.availableForCustomers !== false;
        seeds.push({
          groupId: canonicalGroupId(
            legacyProcess ? groupFromProcessText(detailName, question, example) : categoryGroup!,
          ),
          section: legacyProcess ? "process" : "info",
          detailName,
          question,
          example,
          forCustomers,
        });
      }
    }
  }
  return seeds;
}

const DEFAULT_SEEDS = kbQaSeeds(KB_TEMPLATE);

export function templateQas(categories?: KnowledgeCategory[]): CustomQaItem[] {
  const seeds = categories ? kbQaSeeds(categories) : DEFAULT_SEEDS;
  return seeds.map((item, index) => ({
    id: `tpl-${index + 1}`,
    groupId: item.groupId,
    section: item.section,
    question: item.question,
    answer: "",
    detailName: item.detailName || undefined,
    forCustomers: item.forCustomers,
  }));
}

export function templateExample(id: string) {
  const index = Number(String(id).replace(/^tpl-/, ""));
  if (!Number.isFinite(index) || index < 1) return "";
  return DEFAULT_SEEDS[index - 1]?.example || "";
}

export function isTemplateQaId(id: string) {
  return /^(tpl|kb)-/.test(id);
}

export function withTemplateQas(state: { customQas?: CustomQaItem[] }, importedKb?: boolean) {
  const remapped = (state.customQas || []).map((item) => ({
    ...item,
    groupId: canonicalGroupId(item.groupId),
  }));
  if (importedKb) {
    return withProcessQas(remapped).map((item) => ({ ...item, groupId: canonicalGroupId(item.groupId) }));
  }
  if (remapped.some((item) => isTemplateQaId(item.id))) return remapped;
  if (remapped.length > 0) return [...templateQas(), ...remapped];
  return templateQas();
}

export function draftFromKnowledgeBase(
  categories: KnowledgeCategory[],
  options?: { storeUrl?: string; storeName?: string; demo?: boolean },
): ClarityDraft {
  const storeUrl = options?.storeUrl || "https://mra-il.com";
  const storeName = options?.storeName || "MRA IL";
  const scannedAt = new Date().toISOString();
  const customQas: CustomQaItem[] = kbQaSeeds(categories)
    .filter((item) => item.example.trim())
    .map((item, index) => ({
      id: `kb-${item.groupId}-${index + 1}`,
      groupId: canonicalGroupId(item.groupId),
      section: item.section,
      question: item.question,
      answer: item.example,
      detailName: item.detailName || undefined,
      forCustomers: item.forCustomers,
    }));

  const result: ScanResult = {
    storeUrl,
    storeName,
    scannedAt,
    pagesScanned: [{ url: storeUrl, title: storeName, path: "/" }],
    topics: [],
    demo: options?.demo,
    importedKb: true,
  };

  return {
    id: storeUrl.replace(/^https?:\/\//i, "").replace(/\/$/, "").toLowerCase(),
    savedAt: scannedAt,
    lang: "he",
    result,
    state: {
      storeUrl,
      decisions: {},
      customQas,
    },
  };
}
