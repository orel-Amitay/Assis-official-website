import { isUsableStoreFact } from "./extract";
import { isProcessTopic } from "./focus";
import type { CustomQaItem, ExtractedClaim, ScanResult } from "./types";

const STOP = new Set([
  "את",
  "של",
  "על",
  "עם",
  "או",
  "לא",
  "גם",
  "זה",
  "זו",
  "הוא",
  "היא",
  "יש",
  "אין",
  "כל",
  "מה",
  "איך",
  "אם",
  "כי",
  "the",
  "and",
  "for",
  "from",
  "with",
  "your",
  "you",
  "our",
  "are",
  "is",
  "to",
  "in",
  "of",
  "a",
  "האם",
  "צריך",
  "אפשר",
  "כמה",
  "מתי",
  "איפה",
  "לקנות",
]);

const GENERIC = new Set([
  "נרתיק",
  "נרתיקים",
  "ציוד",
  "מוצר",
  "מוצרים",
  "חנות",
  "אתר",
  "לקוח",
  "הזמנה",
  "משלוח",
  "שירות",
  "מחיר",
  "קנייה",
  "buy",
  "product",
  "products",
  "store",
  "item",
  "holster",
  "gear",
  "equipment",
  "order",
  "shipping",
  "customer",
  "service",
]);

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(/\s+/)
    .filter((word) => word.length > 1 && !STOP.has(word));
}

export function suggestionsForCustomQa(item: CustomQaItem, result: ScanResult, limit = 3): ExtractedClaim[] {
  const topics = result.topics.filter((topic) => topic.group === item.groupId && !isProcessTopic(topic.id));
  const query = tokenize(`${item.detailName || ""} ${item.question || ""}`);
  if (query.length === 0) return [];
  const distinctive = query.filter((word) => !GENERIC.has(word));
  const scored = topics.flatMap((topic) => {
    return topic.claims.map((claim) => {
      if (!isUsableStoreFact(claim.text)) return { claim, score: 0 };
      const words = new Set(tokenize(claim.text));
      const distinctiveHits = distinctive.filter((word) => words.has(word));
      if (distinctive.length > 0 && distinctiveHits.length === 0) return { claim, score: 0 };
      let overlap = 0;
      for (const word of query) {
        if (words.has(word)) overlap += 1;
      }
      if (overlap === 0) return { claim, score: 0 };
      let score = distinctiveHits.length * 4 + overlap * 2;
      if (tokenize(`${topic.title} ${topic.titleHe}`).some((word) => query.includes(word))) score += 2;
      const detail = item.detailName?.trim() || "";
      if (detail && claim.text.includes(detail.slice(0, Math.min(12, detail.length)))) score += 4;
      return { claim, score };
    });
  });
  scored.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const out: ExtractedClaim[] = [];
  for (const row of scored) {
    if (row.score < 6) continue;
    const key = row.claim.text.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(row.claim);
    if (out.length >= limit) break;
  }
  return out;
}

export function isScanRelevantQa(item: CustomQaItem, result: ScanResult) {
  if (item.section === "process") return true;
  if (item.skipped) return false;
  if (result.importedKb || result.demo) return true;
  if (!/^(tpl|kb)-/.test(item.id)) return true;
  if (item.answer.trim() || item.suggestedAnswer?.trim()) return true;
  return suggestionsForCustomQa(item, result, 1).length > 0;
}

export function applyScanRecommendations(result: ScanResult, state: { customQas?: CustomQaItem[] }) {
  return (state.customQas || []).map((item) => {
    if (item.section === "process" || item.skipped || item.answer.trim()) return item;
    const top = suggestionsForCustomQa(item, result, 1)[0];
    if (!top?.text.trim() || !isUsableStoreFact(top.text)) return item;
    return {
      ...item,
      answer: top.text,
      suggestedAnswer: item.suggestedAnswer || top.text,
    };
  });
}
