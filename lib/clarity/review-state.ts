import type {
  ClaimDecision,
  CustomQaItem,
  ReviewState,
  ScanResult,
  TopicDecisionState,
  TopicGroupId,
  TopicId,
  TopicReview,
} from "./types";
import { detectChipIds, formatChipLine, qaChipSet } from "./chips";
import { formatCollectLine } from "./collect-fields";
import { isUsableStoreFact } from "./extract";
import { isActionableTopic, isProcessTopic, ESSENTIAL_TOPICS } from "./focus";
import { qaBlockDone, qaBlocks, questionLabel, questionsForTopic } from "./qa";
import { GROUPS } from "./topics";
import { TOPIC_QUESTIONS } from "./questions";
import type { ClarityLang } from "./copy";

export type KnowledgeQaItem = {
  answer: string;
  approval: "approved" | "pending";
  question: string;
  availableForAgents: boolean;
  availableForCustomers: boolean;
};

export type KnowledgeSection = {
  detailName: string;
  needsReview: boolean;
  detailContent: KnowledgeQaItem[];
};

export type KnowledgeCategory = {
  name: string;
  sections: KnowledgeSection[];
};

function qaItem(
  answer: string,
  question: string,
  approval: "approved" | "pending",
  opts?: { forAgents?: boolean; forCustomers?: boolean },
): KnowledgeQaItem {
  const approved = approval === "approved";
  return {
    answer,
    approval,
    question,
    availableForAgents: opts?.forAgents ?? approved,
    availableForCustomers: opts?.forCustomers ?? approved,
  };
}

export function knowledgeJson(
  result: ScanResult,
  state: ReviewState,
  lang: ClarityLang = "he",
): KnowledgeCategory[] {
  const categories: KnowledgeCategory[] = [];

  for (const group of GROUPS) {
    const topics = result.topics.filter((topic) => topic.group === group.id);
    const sections: KnowledgeSection[] = [];

    const customs = (state.customQas || []).filter((item) => item.groupId === group.id && !item.skipped);
    const byDetail = new Map<string, typeof customs>();
    for (const item of customs) {
      const fallback =
        item.section === "process"
          ? lang === "he"
            ? "תהליך — שאלות שהוספתם"
            : "Process — added questions"
          : lang === "he"
            ? "שאלות שהוספתם"
            : "Added questions";
      const detailName = item.detailName?.trim() || fallback;
      const list = byDetail.get(detailName) || [];
      list.push(item);
      byDetail.set(detailName, list);
    }
    for (const [detailName, list] of byDetail) {
      const detailContent = list.flatMap((item) => {
        const collectLine = formatCollectLine(item.collectFields || [], lang);
        const text = [item.answer.trim(), collectLine].filter(Boolean).join("\n");
        if (!text) return [];
        const approval = item.answer.trim() ? "approved" : "pending";
        const forCustomers = item.forCustomers ?? item.section !== "process";
        const question = item.question.trim() === detailName ? "" : item.question.trim();
        return [
          qaItem(text, question, approval, {
            forAgents: approval === "approved",
            forCustomers: approval === "approved" && forCustomers,
          }),
        ];
      });
      if (detailContent.length === 0) continue;
      sections.push({
        detailName,
        needsReview: detailContent.some((item) => item.approval === "pending"),
        detailContent,
      });
    }

    for (const topic of topics) {
      const topicState = state.decisions[topic.id];
      if (topicState?.notRelevant) continue;
      const forCustomers = !isProcessTopic(topic.id);
      const items: KnowledgeQaItem[] = [];

      const blocks = qaBlocks(topic, state).filter((block) => !block.skipped);
      for (const block of blocks) {
        const approvedClaim = block.claims.find((claim) => block.decisions[claim.id] === "approved");
        const chipLine = formatChipLine(qaChipSet(block.def), block.collectFields, lang);
        const text = [block.answer.trim() || approvedClaim?.text || "", chipLine].filter(Boolean).join("\n").trim();
        if (!text) continue;
        const approval = qaBlockDone(block) ? "approved" : "pending";
        items.push(
          qaItem(text, questionLabel(block.def, lang), approval, {
            forAgents: approval === "approved",
            forCustomers: approval === "approved" && forCustomers,
          }),
        );
      }

      if (items.length === 0) {
        if (!isActionableTopic(topic) && !topicState?.canonicalText.trim()) continue;
        const canonical = topicState?.canonicalText.trim() || "";
        const approved = topic.claims.filter(
          (claim) => topicState?.claimDecisions[claim.id] === "approved",
        );
        const question = lang === "he" ? TOPIC_QUESTIONS[topic.id].he : TOPIC_QUESTIONS[topic.id].en;
        const answers: { text: string; approval: "approved" | "pending" }[] = [];
        if (canonical) answers.push({ text: canonical, approval: "approved" });
        for (const claim of approved) {
          if (!answers.some((item) => item.text === claim.text)) {
            answers.push({ text: claim.text, approval: "approved" });
          }
        }
        for (const item of answers) {
          items.push(
            qaItem(item.text, question, item.approval, {
              forAgents: item.approval === "approved",
              forCustomers: item.approval === "approved" && forCustomers,
            }),
          );
        }
      }

      if (items.length === 0) continue;
      sections.push({
        detailName: lang === "he" ? topic.titleHe : topic.title,
        needsReview: items.some((item) => item.approval === "pending"),
        detailContent: items,
      });
    }

    if (sections.length > 0) {
      categories.push({
        name: lang === "he" ? group.titleHe : group.title,
        sections,
      });
    }
  }

  return categories;
}

export function knowledgeJsonText(result: ScanResult, state: ReviewState, lang: ClarityLang = "he") {
  return `${JSON.stringify(knowledgeJson(result, state, lang), null, 2)}\n`;
}

export function remapLegacyCustomQa(item: CustomQaItem): CustomQaItem {
  if (String(item.groupId) !== "processes") return item;
  const blob = `${item.detailName || ""} ${item.question} ${item.answer}`;
  const groupId: TopicGroupId = /משלוח|שליח|מעקב|shipping|delivery/i.test(blob)
    ? "delivery"
    : /פגם|אחריות|warranty|defect/i.test(blob)
      ? "warranty"
      : "returns";
  return { ...item, groupId, section: "process" };
}

export function applyAiAnswers(
  state: ReviewState,
  suggestions: Array<{ topicId: TopicId; qaId: string; answer: string; missing?: boolean }>,
): ReviewState {
  const next: ReviewState = {
    ...state,
    decisions: { ...state.decisions },
    customQas: [...(state.customQas || [])],
  };
  for (const item of suggestions) {
    if (item.missing || !isUsableStoreFact(item.answer)) continue;
    if (/^(tpl|kb)-/.test(item.qaId)) {
      next.customQas = (next.customQas || []).map((qa) =>
        qa.id === item.qaId && !qa.answer.trim()
          ? { ...qa, answer: item.answer, suggestedAnswer: item.answer, skipped: false, verdict: qa.verdict || "pending" }
          : qa,
      );
      continue;
    }
    const topicState = next.decisions[item.topicId] || emptyTopicState();
    if (topicState.qaAnswers?.[item.qaId]?.trim()) continue;
    next.decisions[item.topicId] = {
      ...topicState,
      qaAnswers: { ...(topicState.qaAnswers || {}), [item.qaId]: item.answer },
      qaSkip: { ...(topicState.qaSkip || {}), [item.qaId]: false },
    };
  }
  return next;
}

export function applyOpenQuestions(
  state: ReviewState,
  items: Array<{ question?: string; answer?: string }>,
  alreadyAsked: string[] = [],
): ReviewState {
  const existing = new Set(
    [...alreadyAsked, ...(state.customQas || []).map((qa) => qa.question)]
      .map((value) => value.trim().toLowerCase().replace(/\s+/g, " "))
      .filter(Boolean),
  );
  const extras = items.flatMap((item, index) => {
    const question = String(item.question || "").trim();
    const answer = String(item.answer || "").trim();
    if (!question || !answer || !isUsableStoreFact(answer)) return [];
    const key = question.toLowerCase().replace(/\s+/g, " ");
    if (existing.has(key)) return [];
    existing.add(key);
    return [
      {
        id: `open-${Date.now()}-${index}`,
        groupId: "open" as const,
        section: "info" as const,
        question,
        answer,
        detailName: "שאלות פתוחות",
        forCustomers: true,
      },
    ];
  });
  if (extras.length === 0) return state;
  return { ...state, customQas: [...(state.customQas || []), ...extras] };
}

export function emptyTopicState(): TopicDecisionState {
  return {
    claimDecisions: {},
    canonicalText: "",
    notRelevant: false,
    qaAnswers: {},
    qaSkip: {},
    qaCollect: {},
  };
}

export function emptyReviewState(result: ScanResult): ReviewState {
  const decisions = {} as ReviewState["decisions"];
  for (const topic of result.topics) {
    const claimDecisions: Record<string, ClaimDecision> = {};
    for (const claim of topic.claims) claimDecisions[claim.id] = "pending";
    const qaCollect: Record<string, string[]> = {};
    const blob = [
      ...topic.claims.map((claim) => claim.text),
      ...result.pagesScanned.map((page) => `${page.url} ${page.title}`),
    ].join("\n");
    for (const def of questionsForTopic(topic.id)) {
      const set = qaChipSet(def);
      if (!set) continue;
      const detected = detectChipIds(set, blob);
      if (detected.length > 0) qaCollect[def.id] = detected;
    }
    decisions[topic.id] = {
      claimDecisions,
      canonicalText: "",
      notRelevant: false,
      qaAnswers: {},
      qaSkip: {},
      qaCollect,
    };
  }
  return { storeUrl: result.storeUrl, decisions, customQas: [], productReviews: {} };
}

function sameStoreUrl(a?: string, b?: string) {
  const norm = (value = "") =>
    value.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "").toLowerCase();
  return !a || !b || norm(a) === norm(b);
}

export function mergeReviewState(result: ScanResult, saved?: ReviewState | null): ReviewState {
  const base = emptyReviewState(result);
  if (!saved?.decisions) return base;
  if (saved.storeUrl && result.storeUrl && !sameStoreUrl(saved.storeUrl, result.storeUrl)) return base;
  for (const topic of result.topics) {
    const prev = saved.decisions[topic.id];
    const current = base.decisions[topic.id];
    if (!prev || !current) continue;
    base.decisions[topic.id] = {
      canonicalText: prev.canonicalText || current.canonicalText,
      claimDecisions: { ...current.claimDecisions, ...prev.claimDecisions },
      notRelevant: prev.notRelevant ?? current.notRelevant,
      qaAnswers: { ...(current.qaAnswers || {}), ...(prev.qaAnswers || {}) },
      qaSkip: { ...(current.qaSkip || {}), ...(prev.qaSkip || {}) },
      qaCollect: { ...(current.qaCollect || {}), ...(prev.qaCollect || {}) },
    };
  }
  base.customQas = (saved.customQas || []).map(remapLegacyCustomQa);
  base.productReviews = { ...(base.productReviews || {}), ...(saved.productReviews || {}) };
  return base;
}

export function storageKey(storeUrl: string, userId?: string) {
  return userId ? `clarity-review:${userId}:${storeUrl}` : `clarity-review:${storeUrl}`;
}

export function topicProgress(topic?: TopicDecisionState) {
  if (!topic) return { approved: 0, rejected: 0, pending: 0, total: 0 };
  const values = Object.values(topic.claimDecisions);
  const approved = values.filter((v) => v === "approved").length;
  const rejected = values.filter((v) => v === "rejected").length;
  const pending = values.filter((v) => v === "pending").length;
  return { approved, rejected, pending, total: values.length };
}

export function topicNeedsReview(topic: TopicReview, state?: TopicDecisionState) {
  if (!state) return true;
  if (state.notRelevant || state.canonicalText.trim()) return false;
  if (topic.claims.length > 0) return topicProgress(state).pending > 0;
  return true;
}

export function approvedFacts(result: ScanResult, state: ReviewState) {
  return result.topics.flatMap((topic) => {
    const topicState = state.decisions[topic.id];
    if (!topicState || topicState.notRelevant) return [];
    const approvedClaims = topic.claims.filter(
      (claim) => topicState.claimDecisions[claim.id] === "approved",
    );
    const rejectedClaims = topic.claims.filter(
      (claim) => topicState.claimDecisions[claim.id] === "rejected",
    );
    const canonical =
      topicState.canonicalText.trim() || approvedClaims[0]?.text || "";
    if (!canonical) return [];
    return [
      {
        topicId: topic.id,
        group: topic.group,
        groupTitle: topic.groupTitle,
        groupTitleHe: topic.groupTitleHe,
        title: topic.title,
        titleHe: topic.titleHe,
        canonical,
        approvedClaims,
        rejectedClaims,
        missingOnSite: topic.status === "missing",
      },
    ];
  });
}

export function stillMissing(result: ScanResult, state: ReviewState) {
  return result.topics.filter((topic) => {
    const topicState = state.decisions[topic.id];
    const hasCanonical = Boolean(topicState?.canonicalText.trim());
    return (
      topic.status === "missing" &&
      ESSENTIAL_TOPICS.includes(topic.id) &&
      !hasCanonical
    );
  });
}

export function sectionKnowledgeText(result: ScanResult, state: ReviewState, topicId: TopicId) {
  const topic = result.topics.find((item) => item.id === topicId);
  if (!topic) return "";
  const topicState = state.decisions[topicId];
  const canonical = topicState?.canonicalText.trim() || "";
  const rejected = topic.claims.filter((claim) => topicState?.claimDecisions[claim.id] === "rejected");
  const lines = [
    `${result.storeName} — ${topic.titleHe} / ${topic.title}`,
    result.storeUrl,
    "",
    "SOURCE OF TRUTH",
    canonical || "(Not written yet.)",
    "",
  ];
  if (rejected.length > 0) {
    lines.push("PAGES TO UPDATE");
    for (const claim of rejected) {
      for (const source of claim.sources) {
        lines.push(`- ${source.path}: “${claim.text}”`);
      }
    }
    lines.push("");
  }
  if (topic.status === "missing") {
    lines.push(`Add this page on the site: ${topic.suggestedPath}`);
    lines.push("");
  }
  return lines.join("\n");
}

export function knowledgeText(result: ScanResult, state: ReviewState) {
  const facts = approvedFacts(result, state);
  const missing = stillMissing(result, state);
  const lines = [`KNOWLEDGE BASE — ${result.storeName}`, result.storeUrl, ""];

  let currentGroup = "";
  for (const fact of facts) {
    if (fact.groupTitle !== currentGroup) {
      currentGroup = fact.groupTitle;
      lines.push(`## ${currentGroup.toUpperCase()}`, "");
    }
    lines.push(fact.title.toUpperCase());
    lines.push(fact.canonical);
    if (fact.missingOnSite) lines.push("(Defined here; not found on the live site yet.)");
    if (fact.rejectedClaims.length > 0) {
      lines.push("Pages to update:");
      for (const claim of fact.rejectedClaims) {
        for (const source of claim.sources) {
          lines.push(`- ${source.path} currently says: “${claim.text}”`);
        }
      }
    }
    lines.push("");
  }

  if (missing.length > 0) {
    lines.push("## STILL MISSING ON THE SITE", "");
    for (const topic of missing) {
      lines.push(`- ${topic.title} — add ${topic.suggestedPath}`);
    }
    lines.push("");
  }

  if (facts.length === 0 && missing.length === 0) {
    lines.push("No approved facts yet.");
  }

  return lines.join("\n").trim() + "\n";
}
