import { qaBlocks } from "./qa";
import type { ExtractedClaim, ReviewState, ScanResult, TopicId, TopicReview } from "./types";

export const ESSENTIAL_TOPICS: TopicId[] = [
  "about",
  "contact",
  "payments",
  "shipping",
  "returns",
  "refunds",
  "cancellations",
];

export const PROCESS_TOPICS: TopicId[] = [
  "process_shipping",
  "process_return",
  "process_exchange",
  "process_refund",
  "process_cancel",
  "process_defect",
];

export const EXTRA_TOPICS: TopicId[] = [...PROCESS_TOPICS, "integrations"];

export function isProcessTopic(topicId: TopicId) {
  return PROCESS_TOPICS.includes(topicId);
}

export function isActionableTopic(topic: TopicReview) {
  if (topic.claims.length > 0) return true;
  return ESSENTIAL_TOPICS.includes(topic.id) || EXTRA_TOPICS.includes(topic.id);
}

export function isEssentialTopic(topicId: TopicId) {
  return ESSENTIAL_TOPICS.includes(topicId);
}

export function reviewTopics(result: ScanResult, state?: ReviewState | null) {
  return result.topics.filter((topic) => {
    if (!isActionableTopic(topic)) return false;
    if (state?.decisions[topic.id]?.notRelevant) return false;
    return true;
  });
}

export function reviewClaims(topic: TopicReview): ExtractedClaim[] {
  const claims = topic.claims;
  if (topic.status === "conflict") return claims.slice(0, 8);
  if (topic.status === "unclear") return claims.slice(0, 3);
  return claims.slice(0, 2);
}

export function splitReview(result: ScanResult) {
  const found = result.topics.filter((topic) => topic.claims.length > 0);
  return {
    conflicts: found.filter((topic) => topic.status === "conflict"),
    confirm: found.filter((topic) => topic.status !== "conflict"),
    missing: result.topics.filter(
      (topic) => ESSENTIAL_TOPICS.includes(topic.id) && topic.claims.length === 0,
    ),
  };
}

export function topicIsResolved(topic: TopicReview, state?: ReviewState | null) {
  const topicState = state?.decisions[topic.id];
  if (!topicState) return false;
  if (topicState.notRelevant) return true;
  if (topicState.canonicalText.trim()) return true;
  return Object.values(topicState.claimDecisions).includes("approved");
}

export function conflictsResolved(_result: ScanResult, _state: ReviewState) {
  return true;
}

export function unresolvedConflictCount(result: ScanResult, state: ReviewState) {
  return result.topics.reduce((count, topic) => {
    if (state.decisions[topic.id]?.notRelevant) return count;
    return count + qaBlocks(topic, state).filter((block) => block.conflict && !block.skipped).length;
  }, 0);
}

export function autoApproveFound(result: ScanResult, state: ReviewState): ReviewState {
  const next: ReviewState = {
    storeUrl: state.storeUrl,
    decisions: { ...state.decisions },
    customQas: state.customQas || [],
    productReviews: state.productReviews || {},
  };

  for (const topic of result.topics) {
    const topicState = next.decisions[topic.id];
    if (!topicState || topicState.notRelevant) continue;

    const qaAnswers = { ...(topicState.qaAnswers || {}) };
    const claimDecisions = { ...topicState.claimDecisions };

    for (const block of qaBlocks(topic, { storeUrl: next.storeUrl, decisions: { [topic.id]: topicState } })) {
      if (block.conflict) continue;
      if (qaAnswers[block.def.id]?.trim()) continue;
      const keep =
        block.claims.find((claim) => claimDecisions[claim.id] === "approved") ||
        block.claims.find((claim) => claimDecisions[claim.id] !== "rejected") ||
        block.claims[0];
      if (!keep) continue;
      qaAnswers[block.def.id] = keep.text;
      for (const claim of block.claims) {
        if (claimDecisions[claim.id] === "pending") {
          claimDecisions[claim.id] = claim.id === keep.id ? "approved" : "rejected";
        }
      }
    }

    const firstAnswer = Object.values(qaAnswers).find((text) => text.trim()) || topicState.canonicalText;
    next.decisions[topic.id] = {
      ...topicState,
      claimDecisions,
      qaAnswers,
      canonicalText: topicState.canonicalText.trim() || firstAnswer || "",
      notRelevant: false,
    };
  }

  return next;
}
