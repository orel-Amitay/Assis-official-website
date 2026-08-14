import { SECTION_GUIDE } from "./checklists";
import { recommendationFor, TOPICS, groupById, type TopicDef } from "./topics";
import { excerptAround } from "./source";
import { splitSentences } from "./html";
import type {
  ClaimSource,
  ExtractedClaim,
  ScanResult,
  TopicId,
  TopicReview,
  TopicStatus,
} from "./types";

export type PageSnapshot = {
  url: string;
  title: string;
  path: string;
  text: string;
};

export function numbersIn(text: string) {
  const withUnit = [
    ...text.matchAll(
      /(\d+)\s*(?:business\s*days?|working\s*days?|days?|hours?|months?|weeks?|ימי\s*עסק(?:ים)?|ימים|יום|שעות|חודשים|שבועות)/gi,
    ),
  ]
    .map((match) => Number(match[1]))
    .filter((n) => Number.isFinite(n) && n > 0 && n <= 365);

  if (withUnit.length > 0) return [...new Set(withUnit)];

  return [
    ...new Set(
      [...text.matchAll(/\d+/g)]
        .map((match) => Number(match[0]))
        .filter((n) => Number.isFinite(n) && n >= 1 && n <= 90),
    ),
  ];
}

export function claimsConflict(a: ExtractedClaim, b: ExtractedClaim) {
  if (a.id === b.id) return false;
  const na = new Set(numbersIn(a.text));
  const nb = new Set(numbersIn(b.text));
  if (na.size > 0 && nb.size > 0 && ![...na].some((n) => nb.has(n))) return true;

  const negative = (text: string) =>
    /\bno returns\b|\bno refunds?\b|אין\s+החזרות|אין\s+החזר\s+כספי|לא\s+ניתן\s+להחזיר/i.test(text);
  if (negative(a.text) !== negative(b.text) && (numbersIn(a.text).length > 0 || numbersIn(b.text).length > 0)) {
    return true;
  }

  const fullRefund = (text: string) =>
    /\bfull refund\b|original payment|החזר\s*כספי\s*מלא|אמצעי\s*התשלום/i.test(text);
  const storeCredit = (text: string) => /\bstore credit\b|זיכוי/i.test(text);
  if ((fullRefund(a.text) && storeCredit(b.text)) || (fullRefund(b.text) && storeCredit(a.text))) {
    return true;
  }
  return false;
}

export function isReviewNoise(text: string) {
  return (
    /\b(?:i (?:bought|ordered|purchased|received|love this)|highly recommend|would recommend|⭐|★{2,}|\b\d(?:\.\d)?\s*\/\s*5\b|yotpo|judge\.me|loox reviews?|testimonials?)\b/i.test(
      text,
    ) ||
    /(?:^|[\n.!?]\s*)(?:קניתי|הזמנתי|קיבלתי את|מומלץ(?:\s+מאוד)?|ממליצ[הה]|שירות מדהים|לקוח(?:ה)? מרוצ[הה]?|ביקורות?|דירוג|כוכבים|וואו+|פשוט מושלם|אין מילים|מטורףף*|ענה(?:ה)? לי תוך)/i.test(
      text,
    ) ||
    /שקיבלתי|יצאתי(?:\s+מהמקום)?|הרגשתי|הגעתי(?:\s+ל[א-ת]+)?|לא מרגיש(?:\s+שהוא)?|ממש נוח|נוח מאוד|שירות\s+(?:מושלם|מדהים|אלוף)|מושלם(?:!|\.)|תוך דקות(?:\s+ספורות)?|הכי טוב|אין על זה|פשוט וואו|תגובות?|comments?\b|customer reviews?/i.test(
      text,
    )
  );
}

export function isVagueFact(text: string) {
  return /\b(usually|typically|generally|often|sometimes|probably|might|in most cases|as a rule)\b|בדרך[\s-]?כלל|לרוב|לעיתים(?:\s*קרובות)?|לפעמים|כנראה|אולי|ייתכן|במקרים רבים|כמעט תמיד/i.test(
    text,
  );
}

export function isUsableStoreFact(text: string) {
  const value = String(text || "").trim();
  if (value.length < 12) return false;
  if (isReviewNoise(value) || isVagueFact(value)) return false;
  return true;
}

export function isReviewPage(path: string, title = "") {
  return /review|testimonial|loox|yotpo|judge[\s.-]?me|comment|ביקורות|המלצות[\s-]?לקוחות|תגובות/i.test(
    `${path} ${title}`,
  );
}

function isLegalBoilerplate(sentence: string) {
  const legal =
    /סמכות\s*שיפוט|הגבלת\s*אחריות|קניין\s*רוחני|תנאי\s*(?:ה)?שימוש|בכפוף\s*לתקנון|governing law|limitation of liability|intellectual property|indemnif|jurisdiction|terms of (?:service|use)\b/i.test(
      sentence,
    );
  const consumer =
    /משלוח|החזר|החלפ|ביטול\s*הזמנה|ימי\s*עסק|shipping|return|refund|delivery|pickup|איסוף|אמצעי\s*תשלום|שעות\s*פעילות/i.test(
      sentence,
    );
  return legal && !consumer;
}

function looksLikeClaim(sentence: string, topic: TopicDef) {
  if (isLegalBoilerplate(sentence)) return false;
  if (isReviewNoise(sentence)) return false;
  if (/תאריך שליחה|gift send date|פריטים לא מספיקים/i.test(sentence)) return false;
  if (!topic.keywords.test(sentence)) return false;

  if (
    topic.id === "shipping" &&
    /\b(international|worldwide|abroad|overseas|חו["״]ל|בינלאומ)/i.test(sentence)
  ) {
    return false;
  }
  if (
    topic.id === "shipping" &&
    /\b(self[- ]?pickup|click\s*&\s*collect|איסוף\s*עצמי)/i.test(sentence) &&
    !/\b(ship|shipping|משלוח)/i.test(sentence)
  ) {
    return false;
  }
  if (
    topic.id === "shipping" &&
    /\b(returns?|refunds?|exchange|החזר|החלפ)/i.test(sentence) &&
    !/\b(ship|shipping|משלוח)/i.test(sentence)
  ) {
    return false;
  }
  if (
    topic.id === "shipping" &&
    /זמן\s*י[צץ]ור|production time|made to order/i.test(sentence) &&
    !/\b(ship|shipping|משלוח)/i.test(sentence)
  ) {
    return false;
  }
  if (
    topic.id === "returns" &&
    /\b(exchange|החלפ)/i.test(sentence) &&
    !/\b(return|החזר)/i.test(sentence)
  ) {
    return false;
  }
  if (
    topic.id === "exchanges" &&
    /\b(return|החזרה|החזרות|refund)/i.test(sentence) &&
    !/\b(exchange|החלפ)/i.test(sentence)
  ) {
    return false;
  }
  if (
    topic.id === "locations" &&
    /\b(shipping address|billing address|כתובת\s*למשלוח)/i.test(sentence)
  ) {
    return false;
  }
  if (topic.id === "about") {
    if (
      /\b(shipping|returns?|refunds?|exchange|warranty|coupon|tracking|checkout|משלוח|החזר(?:ות)?|החלפ|קופון|אחריות|מעקב|אמצעי\s*תשלום|שעות\s*פעילות)\b/i.test(
        sentence,
      ) &&
      !/\b(about|story|founded|אודות|הסיפור|הוקמ|מי אנחנו|חזון)\b/i.test(sentence)
    ) {
      return false;
    }
    if (/\b(stars?|review|\d\s*\/\s*5|דירוג|ביקורת)\b/i.test(sentence) && sentence.length < 90) {
      return false;
    }
    return true;
  }

  if (
    topic.id.startsWith("process_") ||
    topic.id === "integrations" ||
    topic.id === "product_info" ||
    topic.id === "product_edit"
  ) {
    return true;
  }

  const hasNumber = numbersIn(sentence).length > 0;
  const hasPolicyVerb =
    /\b(within|up to|before|after|must|may|will|free|not|only|issued|store credit|no returns|no refund|accept|available|include|open|founded)\b|עד|תוך|לפני|אחרי|אין|לא\s+ניתן|חינם|ימי|יום|זיכוי|ניתן|פתוח|הוקמ|מקבלים|מכבדים|ספק|התייקרות|יעודכנו|מהרו|הצטרפ|מועדון|הטבות|בתיאום|כחול\s*לבן|משרד\s*הביטחון|פחות\s*מ|חזרה\s*למלאי|ניצור|תהליך|שלב|לאסוף|שלחו\s*תמונה|צרו\s*קשר|פנו\s*אלינו/i.test(
      sentence,
    );
  return hasNumber || hasPolicyVerb;
}

function normalizeForMerge(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fingerprint(topicId: TopicId, text: string) {
  const nums = numbersIn(text)
    .sort((a, b) => a - b)
    .join("-");
  const words = normalizeForMerge(text)
    .split(" ")
    .filter((w) => w.length > 2);
  const head = words.slice(0, 10).join(" ");
  return `${topicId}|${nums}|${head}`;
}

export function extractClaims(pages: PageSnapshot[]): ExtractedClaim[] {
  const byFingerprint = new Map<string, ExtractedClaim>();

  for (const page of pages) {
    if (isReviewPage(page.path, page.title)) continue;
    const sentences = splitSentences(page.text);
    for (let index = 0; index < sentences.length; index++) {
      const sentence = sentences[index];
      for (const topic of TOPICS) {
        if (!looksLikeClaim(sentence, topic)) continue;
        const id = fingerprint(topic.id, sentence);
        const existing = byFingerprint.get(id);
        const source = {
          url: page.url,
          pageTitle: page.title || page.path,
          path: page.path,
          excerpt: excerptAround(sentences, index),
        };
        if (existing) {
          if (!existing.sources.some((item) => item.url === source.url)) {
            existing.sources.push(source);
          }
          continue;
        }
        byFingerprint.set(id, {
          id,
          topicId: topic.id,
          text: sentence,
          sources: [source],
        });
      }
    }
  }

  return [...byFingerprint.values()];
}

const MAX_CLAIMS_PER_TOPIC = 8;

function claimScore(claim: ExtractedClaim) {
  const nums = numbersIn(claim.text).length;
  const sources = claim.sources.length;
  const policySource = claim.sources.some((source) =>
    /polic|shipping|return|refund|faq|about|contact|warranty|terms|תקנון|משלוח|החזר|אודות|our-story/i.test(
      source.path,
    ),
  )
    ? 6
    : 0;
  const aboutSource =
    claim.topicId === "about" &&
    claim.sources.some((source) => /about|our-story|אודות|הסיפור/i.test(`${source.path} ${source.pageTitle}`))
      ? 10
      : 0;
  return sources * 8 + nums * 4 + policySource + aboutSource;
}

function selectClaims(claims: ExtractedClaim[]) {
  return [...claims].sort((a, b) => claimScore(b) - claimScore(a)).slice(0, MAX_CLAIMS_PER_TOPIC);
}

function numberSetsConflict(claims: ExtractedClaim[]) {
  const sets = claims
    .map((claim) => new Set(numbersIn(claim.text)))
    .filter((set) => set.size > 0);
  for (let i = 0; i < sets.length; i++) {
    for (let j = i + 1; j < sets.length; j++) {
      const overlap = [...sets[i]].some((n) => sets[j].has(n));
      if (!overlap) return true;
    }
  }
  return false;
}

function topicStatus(claims: ExtractedClaim[], matchedPages: ClaimSource[]): TopicStatus {
  if (claims.length === 0) return matchedPages.length > 0 ? "unclear" : "missing";
  if (numberSetsConflict(claims)) return "conflict";

  const negative = claims.some((claim) =>
    /\bno returns\b|\bno refunds?\b|אין\s+החזרות|אין\s+החזר\s+כספי|לא\s+ניתן\s+להחזיר/i.test(
      claim.text,
    ),
  );
  const positiveWindow = claims.some((claim) => numbersIn(claim.text).length > 0);
  if (negative && positiveWindow) return "conflict";

  const fullRefund = claims.some((claim) =>
    /\bfull refund\b|original payment|החזר\s*כספי\s*מלא|אמצעי\s*התשלום/i.test(claim.text),
  );
  const storeCredit = claims.some((claim) => /\bstore credit\b|זיכוי/i.test(claim.text));
  if (fullRefund && storeCredit) return "conflict";
  if (claims.length === 1 && numbersIn(claims[0].text).length === 0) return "unclear";
  return "clear";
}

function matchedPagesFor(topic: TopicDef, pages: PageSnapshot[]): ClaimSource[] {
  const seen = new Set<string>();
  const out: ClaimSource[] = [];
  for (const page of pages) {
    if (!topic.pathHints.test(page.path) && !topic.pathHints.test(page.title)) continue;
    if (seen.has(page.url)) continue;
    seen.add(page.url);
    out.push({ url: page.url, pageTitle: page.title || page.path, path: page.path });
  }
  return out;
}

export function buildScanResult(input: {
  storeUrl: string;
  storeName: string;
  pages: PageSnapshot[];
  demo?: boolean;
}): ScanResult {
  const claims = extractClaims(input.pages);
  const topics: TopicReview[] = TOPICS.map((topic) => {
    const topicClaims = selectClaims(claims.filter((claim) => claim.topicId === topic.id));
    const matchedPages = matchedPagesFor(topic, input.pages);
    const status = topicStatus(topicClaims, matchedPages);
    const rec = recommendationFor(
      topic,
      status,
      topicClaims.flatMap((claim) => numbersIn(claim.text)),
    );
    const group = groupById(topic.group);
    const guide = SECTION_GUIDE[topic.id];
    return {
      id: topic.id,
      group: topic.group,
      groupTitle: group.title,
      groupTitleHe: group.titleHe,
      title: topic.title,
      titleHe: topic.titleHe,
      status,
      recommendation: rec.en,
      recommendationHe: rec.he,
      suggestedPath: topic.suggestedPath,
      exampleCanonical: topic.exampleCanonical,
      exampleCanonicalHe: topic.exampleCanonicalHe,
      writeChecklist: guide.write,
      writeChecklistHe: guide.writeHe,
      aiWhy: guide.aiWhy,
      aiWhyHe: guide.aiWhyHe,
      claims: topicClaims,
      matchedPages,
    };
  }).filter((topic) => topic.claims.length > 0);

  return {
    storeUrl: input.storeUrl,
    storeName: input.storeName,
    scannedAt: new Date().toISOString(),
    pagesScanned: input.pages.map((page) => ({
      url: page.url,
      title: page.title,
      path: page.path,
    })),
    topics,
    demo: input.demo,
  };
}
