import { SECTION_GUIDE } from "./checklists";
import { PROCESS_TOPICS } from "./focus";
import { withTemplateQas } from "./import-kb";
import { mergeReviewState } from "./review-state";
import { groupById, TOPICS } from "./topics";
import type { ReviewState, ScanResult, TopicReview } from "./types";

export function withProcessTopics(result: ScanResult): ScanResult {
  const remapped = result.topics.map((topic) => {
    const def = TOPICS.find((item) => item.id === topic.id);
    if (!def || def.group === topic.group) return topic;
    const group = groupById(def.group);
    return { ...topic, group: def.group, groupTitle: group.title, groupTitleHe: group.titleHe };
  });
  const have = new Set(remapped.map((topic) => topic.id));
  const wanted = PROCESS_TOPICS;
  const extra: TopicReview[] = TOPICS.filter((topic) => wanted.includes(topic.id) && !have.has(topic.id)).map((topic) => {
    const group = groupById(topic.group);
    const guide = SECTION_GUIDE[topic.id];
    return {
      id: topic.id,
      group: topic.group,
      groupTitle: group.title,
      groupTitleHe: group.titleHe,
      title: topic.title,
      titleHe: topic.titleHe,
      status: "missing",
      recommendation: topic.missingEn,
      recommendationHe: topic.missingHe,
      suggestedPath: topic.suggestedPath,
      exampleCanonical: topic.exampleCanonical,
      exampleCanonicalHe: topic.exampleCanonicalHe,
      writeChecklist: guide.write,
      writeChecklistHe: guide.writeHe,
      aiWhy: guide.aiWhy,
      aiWhyHe: guide.aiWhyHe,
      claims: [],
      matchedPages: [],
    };
  });
  if (extra.length === 0) return { ...result, topics: remapped };
  return { ...result, topics: [...remapped, ...extra] };
}

export function hydrateClarity(result: ScanResult, saved?: ReviewState | null) {
  const nextResult = withProcessTopics(result);
  const state = mergeReviewState(nextResult, saved);
  return {
    result: nextResult,
    state: {
      ...state,
      customQas: withTemplateQas(state, result.importedKb),
    },
  };
}
