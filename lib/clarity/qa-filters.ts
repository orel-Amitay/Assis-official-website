import { COPY, type ClarityLang } from "./copy";
import type { CustomQaItem } from "./types";

export type QaFilter = "approved" | "rejected" | "edited" | "na" | "missing" | "pending";

export const QA_FILTERS: QaFilter[] = ["approved", "rejected", "edited", "na", "missing", "pending"];

export function qaFilterLabel(lang: ClarityLang, id: QaFilter) {
  const t = COPY[lang];
  if (id === "approved") return t.filterApproved;
  if (id === "rejected") return t.filterRejected;
  if (id === "edited") return t.filterEdited;
  if (id === "na") return t.filterNa;
  if (id === "missing") return t.filterMissing;
  return t.filterPending;
}

export function customFilterFlags(item: {
  skipped?: boolean;
  notApplicable?: boolean;
  verdict?: string;
  answer?: string;
  suggestedAnswer?: string;
}): Set<QaFilter> {
  const flags = new Set<QaFilter>();
  if (item.skipped || item.notApplicable) {
    flags.add("na");
    return flags;
  }
  if (item.verdict === "approved") flags.add("approved");
  if (item.verdict === "rejected") flags.add("rejected");
  const answer = String(item.answer || "").trim();
  const suggested = String(item.suggestedAnswer || "").trim();
  if (!answer) flags.add("missing");
  else if (item.verdict !== "approved" && item.verdict !== "rejected") flags.add("pending");
  if (answer && suggested && answer !== suggested) flags.add("edited");
  return flags;
}

export function countQaFilters(items: Array<Parameters<typeof customFilterFlags>[0]>) {
  const counts: Partial<Record<QaFilter, number>> = {};
  for (const item of items) {
    for (const flag of customFilterFlags(item)) counts[flag] = (counts[flag] || 0) + 1;
  }
  return counts;
}

export function matchesQaFilters(flags: Set<QaFilter>, selected: QaFilter[]) {
  if (!selected.length) return true;
  return selected.some((filter) => flags.has(filter));
}

export function toggleQaFilter(selected: QaFilter[], id: QaFilter): QaFilter[] {
  return selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id];
}

export function customMatchesFilters(item: CustomQaItem, selected: QaFilter[]) {
  return matchesQaFilters(customFilterFlags(item), selected);
}
