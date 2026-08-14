import { aiFillCategory, aiFillOpenQuestions, hasCategoryAi, type CategorySuggestion, type OpenQaSuggestion } from "./ai-fill";
import { extractClaims } from "./extract";
import { isProcessTopic } from "./focus";
import { templateQas } from "./import-kb";
import { assignQa, questionsForTopic } from "./qa";
import { scanCategoryStore, scanStoreWithPages } from "./scan";
import { groupById, TOPICS } from "./topics";
import type { ClarityLang } from "./copy";
import type { ExtractedClaim, TopicGroupId } from "./types";

export type CategoryScanResult = {
  storeUrl: string;
  storeName: string;
  pages: number;
  claims: ExtractedClaim[];
  suggestions: CategorySuggestion[];
  openQas?: OpenQaSuggestion[];
  missingQaIds: string[];
  usedAi: boolean;
};

export async function runCategoryScan(
  url: string,
  groupId: TopicGroupId,
  lang: ClarityLang,
): Promise<CategoryScanResult> {
  if (groupId === "open") {
    const { result, pages } = await scanStoreWithPages(url);
    const openQas = await aiFillOpenQuestions({
      pages,
      lang,
      existingQuestions: templateQas().map((item) => item.question),
    });
    return {
      storeUrl: result.storeUrl,
      storeName: result.storeName,
      pages: pages.length,
      claims: [],
      suggestions: [],
      openQas,
      missingQaIds: [],
      usedAi: hasCategoryAi(),
    };
  }

  const focused = await scanCategoryStore(url, groupId);
  const groupTopics = new Set(TOPICS.filter((topic) => topic.group === groupId).map((topic) => topic.id));
  const claims = extractClaims(focused.pages).filter((claim) => groupTopics.has(claim.topicId));
  const group = groupById(groupId);
  const suggestions = await aiFillCategory({
    groupId,
    groupTitle: lang === "he" ? group.titleHe : group.title,
    pages: focused.pages,
    lang,
  });

  const covered = new Set<string>();
  for (const claim of claims) covered.add(assignQa(claim.topicId, claim.text));
  for (const item of suggestions) {
    if (!item.missing && item.answer.trim()) covered.add(item.qaId);
  }

  const missingQaIds = [
    ...templateQas()
      .filter((item) => item.groupId === groupId && !covered.has(item.id))
      .map((item) => item.id),
    ...TOPICS.filter((topic) => topic.group === groupId && isProcessTopic(topic.id)).flatMap((topic) =>
      questionsForTopic(topic.id)
        .filter((def) => def.alwaysShow && !covered.has(def.id))
        .map((def) => def.id),
    ),
  ];

  return {
    storeUrl: focused.storeUrl,
    storeName: focused.storeName,
    pages: focused.pages.length,
    claims,
    suggestions,
    missingQaIds,
    usedAi: hasCategoryAi(),
  };
}
