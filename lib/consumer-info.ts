import mraExport from "@/lib/clarity/fixtures/consumer-mra-il.json";
import { knowledgeFileSlug } from "@/lib/clarity/knowledge-export";
import { knowledgeJson, type KnowledgeCategory } from "@/lib/clarity/review-state";
import type { ClarityLang } from "@/lib/clarity/copy";
import type { ClarityDraft } from "@/lib/clarity/draft";

export type ConsumerQa = {
  question: string;
  answer: string;
};

export type ConsumerTopic = {
  name: string;
  items: ConsumerQa[];
};

export type ConsumerCategory = {
  id: string;
  name: string;
  topics: ConsumerTopic[];
};

export type ConsumerInfo = {
  slug: string;
  storeName: string;
  storeUrl: string;
  savedAt: string | null;
  lang: ClarityLang;
  source: "live" | "fixture";
  logo?: string | null;
  categories: ConsumerCategory[];
};

type RawQa = {
  answer?: unknown;
  question?: unknown;
  approval?: unknown;
  availableForCustomers?: unknown;
  notApplicable?: unknown;
};

type RawTopic = {
  detailName?: unknown;
  detailContent?: unknown;
};

type RawCategory = {
  name?: unknown;
  sections?: unknown;
};

type WrappedExport = {
  storeName?: unknown;
  storeUrl?: unknown;
  savedAt?: unknown;
  lang?: unknown;
  sections?: unknown;
};

const IRRELEVANT = /^(לא רלוונטי לעסק|not applicable|n\/a)\.?$/i;

const SKIP_CUSTOMER_ITEM =
  /LUCID|לגרמניה|מדידה וירטואלית|משפיענים|תוכנית שותפים|בעמוד המוצר מופיעים|כאן אפשר לציין/i;

const CATEGORY_LABEL: Record<string, string> = {
  מותג: "אודות",
  חנויות: "איסוף",
  "חבר מועדון, קהילה וניוזלטר": "מועדון",
  "כרטיס מתנה (גיפטקארד) והזמנות מתנה": "מתנות",
  תשלום: "תשלום",
  הזמנות: "הזמנות",
  משלוחים: "משלוחים",
  מלאי: "מלאי",
  "החלפות / החזרות": "החזרות",
  "החלפות החזרות": "החזרות",
  "מידע נוסף": "עוד מידע",
  "מידע נוסף - מוצרים": "מוצרים",
  מוצרים: "מוצרים",
};

const CATEGORY_ORDER = [
  "משלוחים",
  "החזרות",
  "הזמנות",
  "תשלום",
  "איסוף",
  "מועדון",
  "אודות",
  "מוצרים",
  "עוד מידע",
  "מלאי",
  "מתנות",
];

function customerCategoryName(name: string) {
  return CATEGORY_LABEL[name] || name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function customerTopicName(name: string) {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function customerQuestion(question: string, topicName: string) {
  let next = question.trim();
  if (!next) return "";
  if (/כאן אפשר|נא לציין|ציין |לאסוף מהלקוח|אם כן\s*[—-]/.test(next)) return "";
  if (/יש לנו על|שכדאי לדעת על המותג|בעמוד המוצר מופיעים/.test(next)) return "";
  next = next
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/^האם המשתמשים?\s+/u, "האם ")
    .replace(/\sהמשתמש\s/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (!next || next === topicName) return "";
  return next;
}

const FIXTURES: Record<string, WrappedExport> = {
  "mra-il": mraExport,
};

export const CONSUMER_INFO_STORES: Record<
  string,
  { hosts: string[]; aliases: string[]; logo?: string }
> = {
  "mra-il": {
    hosts: ["mratactical.com", "mra-il.com"],
    aliases: ["mra-il", "mratactical", "mra"],
    logo: "/brand/stores/mra-il-logo.png",
  },
};

export function canonicalConsumerSlug(value: string) {
  const slug = knowledgeFileSlug(value);
  for (const [canonical, meta] of Object.entries(CONSUMER_INFO_STORES)) {
    if (canonical === slug || meta.aliases.includes(slug) || meta.hosts.some((host) => slug.includes(host.split(".")[0]))) {
      return canonical;
    }
  }
  return slug;
}

export function consumerInfoSlugs() {
  return Object.keys(CONSUMER_INFO_STORES);
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isCustomerQa(item: RawQa) {
  if (item.notApplicable === true) return false;
  if (item.availableForCustomers !== true) return false;
  if (item.approval && item.approval !== "approved") return false;
  const answer = asString(item.answer);
  const question = asString(item.question);
  if (!answer || IRRELEVANT.test(answer)) return false;
  if (SKIP_CUSTOMER_ITEM.test(`${question} ${answer}`)) return false;
  return true;
}

function topicId(name: string, index: number) {
  const slug = knowledgeFileSlug(name) || `topic-${index + 1}`;
  return `c-${index}-${slug}`;
}

export function consumerCategoriesFromKnowledge(
  categories: KnowledgeCategory[] | RawCategory[],
): ConsumerCategory[] {
  const mapped = categories
    .map((category, index) => {
      const name = customerCategoryName(asString(category.name));
      const topics = (Array.isArray(category.sections) ? category.sections : [])
        .map((section) => {
          const topic = section as RawTopic;
          const topicName = customerTopicName(asString(topic.detailName));
          const items = (Array.isArray(topic.detailContent) ? topic.detailContent : [])
            .filter((entry): entry is RawQa => Boolean(entry) && typeof entry === "object")
            .filter(isCustomerQa)
            .map((entry) => ({
              question: customerQuestion(asString(entry.question), topicName),
              answer: asString(entry.answer),
            }));
          return { name: topicName, items };
        })
        .filter((topic) => topic.items.length > 0);
      return {
        id: topicId(name, index),
        name,
        topics,
      };
    })
    .filter((category) => category.name && category.topics.length > 0);

  return mapped.sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.name);
    const bi = CATEGORY_ORDER.indexOf(b.name);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

function isKnowledgeCategories(value: unknown): value is KnowledgeCategory[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        item &&
        typeof item === "object" &&
        typeof (item as RawCategory).name === "string" &&
        Array.isArray((item as RawCategory).sections),
    )
  );
}

function isWrappedExport(value: unknown): value is WrappedExport {
  return Boolean(
    value &&
      typeof value === "object" &&
      Array.isArray((value as WrappedExport).sections) &&
      (typeof (value as WrappedExport).storeName === "string" ||
        typeof (value as WrappedExport).storeUrl === "string"),
  );
}

function isDraftLike(value: unknown): value is ClarityDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as ClarityDraft;
  return Boolean(draft.result?.storeUrl && draft.state && typeof draft.state === "object");
}

export function consumerInfoFromUnknown(
  value: unknown,
  fallback: { slug: string; storeName?: string; storeUrl?: string; savedAt?: string; lang?: ClarityLang; source: ConsumerInfo["source"] },
): ConsumerInfo | null {
  if (isWrappedExport(value)) {
    const categories = consumerCategoriesFromKnowledge(value.sections as RawCategory[]);
    if (categories.length === 0) return null;
    const lang = value.lang === "en" ? "en" : "he";
    return {
      slug: fallback.slug,
      storeName: asString(value.storeName) || fallback.storeName || "Store",
      storeUrl: asString(value.storeUrl) || fallback.storeUrl || "",
      savedAt: asString(value.savedAt) || fallback.savedAt || null,
      lang,
      source: fallback.source,
      logo: CONSUMER_INFO_STORES[fallback.slug]?.logo || null,
      categories,
    };
  }

  if (isKnowledgeCategories(value)) {
    const categories = consumerCategoriesFromKnowledge(value);
    if (categories.length === 0) return null;
    return {
      slug: fallback.slug,
      storeName: fallback.storeName || "Store",
      storeUrl: fallback.storeUrl || "",
      savedAt: fallback.savedAt || null,
      lang: fallback.lang || "he",
      source: fallback.source,
      logo: CONSUMER_INFO_STORES[fallback.slug]?.logo || null,
      categories,
    };
  }

  if (isDraftLike(value)) {
    const lang: ClarityLang = value.lang === "en" ? "en" : "he";
    const categories = consumerCategoriesFromKnowledge(knowledgeJson(value.result, value.state, lang));
    if (categories.length === 0) return null;
    return {
      slug: fallback.slug,
      storeName: value.result.storeName || fallback.storeName || "Store",
      storeUrl: value.result.storeUrl || fallback.storeUrl || "",
      savedAt: value.savedAt || fallback.savedAt || null,
      lang,
      source: fallback.source,
      logo: CONSUMER_INFO_STORES[fallback.slug]?.logo || null,
      categories,
    };
  }

  return null;
}

export function fixtureConsumerInfo(slug: string): ConsumerInfo | null {
  const canonical = canonicalConsumerSlug(slug);
  const fixture = FIXTURES[canonical];
  if (!fixture) return null;
  return consumerInfoFromUnknown(fixture, {
    slug: canonical,
    source: "fixture",
  });
}

function qaCount(info: ConsumerInfo) {
  return info.categories.reduce(
    (total, category) => total + category.topics.reduce((sum, topic) => sum + topic.items.length, 0),
    0,
  );
}

export async function loadConsumerInfo(slug: string): Promise<ConsumerInfo | null> {
  const canonical = canonicalConsumerSlug(slug);
  const fixture = fixtureConsumerInfo(canonical);
  const live = await loadLiveConsumerInfo(canonical);

  if (live && (!fixture || qaCount(live) >= Math.max(8, Math.floor(qaCount(fixture) * 0.6)))) {
    return live;
  }

  return fixture || live;
}

async function loadLiveConsumerInfo(slug: string): Promise<ConsumerInfo | null> {
  try {
    const { databaseUrl } = await import("@/lib/clarity/db");
    if (!databaseUrl()) return null;
    const { findPublicClarityDraft } = await import("@/lib/clarity/cloud");
    const meta = CONSUMER_INFO_STORES[slug];
    const row = await findPublicClarityDraft({
      slug,
      aliases: meta?.aliases,
      hosts: meta?.hosts,
    });
    if (!row) return null;

    const payload =
      typeof row.payload === "string"
        ? (JSON.parse(row.payload) as unknown)
        : row.payload;

    return consumerInfoFromUnknown(payload, {
      slug,
      storeName: row.storeName,
      storeUrl: row.storeUrl,
      savedAt: row.savedAt,
      lang: row.lang,
      source: "live",
    });
  } catch {
    return null;
  }
}
