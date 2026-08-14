import type { ClarityDraft } from "./draft";
import mraKb from "./fixtures/knowledge-base-mra-il.json";
import type { KnowledgeCategory } from "./review-state";
import { GROUPS } from "./topics";
import { withProcessQas } from "./process-templates";
import type { CustomQaItem, ScanResult, TopicGroupId } from "./types";

const CATEGORY_ALIASES: Record<string, TopicGroupId> = {
  "שאלות תשובות - מהאתר": "site_qa",
  "site q&a": "site_qa",
  "מידע כללי": "general",
  "general info": "general",
  משלוחים: "delivery",
  shipping: "delivery",
  "החלפות החזרות": "returns",
  "returns & exchanges": "returns",
  "פגמים/אחריות": "warranty",
  "defects & warranty": "warranty",
  "מבצעים הנחות והטבות": "promos",
  "promos & discounts": "promos",
  "מידע נוסף - מוצרים": "products",
  "more product info": "products",
  "מידע על מוצרים": "products",
  "לפני רכישה/מכירה": "prebuy",
  "before purchase": "prebuy",
  "משפיעניות וקודי קופון": "influencers",
  "influencers & coupon codes": "influencers",
  "דגשים חשובים": "notes",
  "important notes": "notes",
  "שעות פעילות מענה שירות לקוחות וואטסאפ": "service",
  "support hours": "service",
  חשבוניות: "billing",
  invoices: "billing",
  "פלטפורמות ואינטגרציות": "integrations",
  "platforms & integrations": "integrations",
  "שאלות פתוחות": "open",
  "open questions": "open",
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
  if (/פגם|אחריות|warranty|defect/i.test(blob)) return "warranty";
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
        const groupId = legacyProcess
          ? groupFromProcessText(detailName, question, example)
          : categoryGroup!;
        seeds.push({
          groupId,
          section: legacyProcess ? "process" : "info",
          detailName,
          question,
          example,
          forCustomers,
        });
      }
    }
  }
  if (!seeds.some((item) => item.groupId === "service")) {
    seeds.push(
      {
        groupId: "service",
        section: "info",
        detailName: "שעות פעילות",
        question: "מה שעות פעילות מענה אנושי בוואטסאפ?",
        example: "",
        forCustomers: true,
      },
      {
        groupId: "service",
        section: "info",
        detailName: "שעות פעילות",
        question: "איך יוצרים קשר? יש מייל?",
        example: "",
        forCustomers: true,
      },
      {
        groupId: "service",
        section: "info",
        detailName: "שעות פעילות",
        question: "תוך כמה זמן חוזרים אליי?",
        example: "",
        forCustomers: true,
      },
    );
  }
  return seeds;
}

const DEFAULT_SEEDS = kbQaSeeds(mraKb as KnowledgeCategory[]);

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
  if (importedKb) return withProcessQas(state.customQas || []);
  const existing = state.customQas || [];
  if (existing.some((item) => isTemplateQaId(item.id))) return withProcessQas(existing);
  if (existing.length > 0) return withProcessQas([...templateQas(), ...existing]);
  return withProcessQas(templateQas());
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
      groupId: item.groupId,
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
