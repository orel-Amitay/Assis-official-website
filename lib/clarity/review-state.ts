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
import { isUsableKbAnswer } from "./extract";
import { shortDashes } from "./text";
import { isCoreKbQuestion, isOptionalKbSection, optionalSectionEvidence, GROUP_PAGE_HINTS } from "./kb-template";
import { matchPageSource } from "./source";
import { isActionableTopic, isProcessTopic, ESSENTIAL_TOPICS } from "./focus";
import { qaBlockDone, qaBlocks, questionLabel, questionsForTopic } from "./qa";
import { GROUPS } from "./topics";
import { TOPIC_QUESTIONS } from "./questions";
import { COPY, type ClarityLang } from "./copy";

export type KnowledgeQaItem = {
  answer: string;
  approval: "approved" | "pending";
  question: string;
  availableForAgents: boolean;
  availableForCustomers: boolean;
  notApplicable?: boolean;
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
  opts?: { forAgents?: boolean; forCustomers?: boolean; notApplicable?: boolean },
): KnowledgeQaItem {
  const approved = approval === "approved";
  return {
    answer,
    approval,
    question,
    availableForAgents: opts?.forAgents ?? approved,
    availableForCustomers: opts?.forCustomers ?? approved,
    ...(opts?.notApplicable ? { notApplicable: true } : {}),
  };
}

export function knowledgeJson(
  result: ScanResult,
  state: ReviewState,
  lang: ClarityLang = "he",
  options?: { includeNotApplicable?: boolean },
): KnowledgeCategory[] {
  const categories: KnowledgeCategory[] = [];
  const includeNa = Boolean(options?.includeNotApplicable);
  const naLabel = COPY[lang].statusNa;

  for (const group of GROUPS) {
    const topics = result.topics.filter((topic) => topic.group === group.id);
    const sections: KnowledgeSection[] = [];

    const customs = (state.customQas || []).filter((item) => {
      if (item.groupId !== group.id) return false;
      if (includeNa) return true;
      return !item.skipped && !item.notApplicable;
    });
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
        const na = Boolean(item.skipped || item.notApplicable);
        const text =
          [item.answer.trim(), collectLine].filter(Boolean).join("\n") || (includeNa && na ? naLabel : "");
        if (!text) return [];
        const approval = na || item.answer.trim() ? "approved" : "pending";
        const forCustomers = item.forCustomers ?? item.section !== "process";
        const question =
          includeNa || item.question.trim() !== detailName ? item.question.trim() : "";
        return [
          qaItem(text, question, approval, {
            forAgents: approval === "approved",
            forCustomers: approval === "approved" && forCustomers && !na,
            notApplicable: na,
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
      if (topicState?.notRelevant) {
        if (!includeNa) continue;
        sections.push({
          detailName: lang === "he" ? topic.titleHe : topic.title,
          needsReview: false,
          detailContent: [
            qaItem(naLabel, lang === "he" ? TOPIC_QUESTIONS[topic.id].he : TOPIC_QUESTIONS[topic.id].en, "approved", {
              forAgents: true,
              forCustomers: false,
              notApplicable: true,
            }),
          ],
        });
        continue;
      }
      const forCustomers = !isProcessTopic(topic.id);
      const items: KnowledgeQaItem[] = [];

      const blocks = includeNa ? qaBlocks(topic, state) : qaBlocks(topic, state).filter((block) => !block.skipped);
      for (const block of blocks) {
        const approvedClaim = block.claims.find((claim) => block.decisions[claim.id] === "approved");
        const chipLine = formatChipLine(qaChipSet(block.def), block.collectFields, lang);
        const na = Boolean(block.skipped);
        const text =
          [block.answer.trim() || approvedClaim?.text || "", chipLine].filter(Boolean).join("\n").trim() ||
          (includeNa && na ? naLabel : "");
        if (!text) continue;
        const approval = na || qaBlockDone(block) ? "approved" : "pending";
        items.push(
          qaItem(text, block.question.trim() || questionLabel(block.def, lang), approval, {
            forAgents: approval === "approved",
            forCustomers: approval === "approved" && forCustomers && !na,
            notApplicable: na,
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

export function toAssisKnowledgeJson(categories: KnowledgeCategory[]): KnowledgeCategory[] {
  return categories
    .map((category) => ({
      name: category.name,
      sections: category.sections
        .map((section) => ({
          detailName: section.detailName,
          needsReview: Boolean(section.needsReview),
          detailContent: section.detailContent
            .filter((item) => !item.notApplicable && String(item.answer || "").trim())
            .map((item) => ({
              answer: item.answer,
              approval: item.approval === "approved" ? ("approved" as const) : ("pending" as const),
              question: item.question || "",
              availableForAgents: Boolean(item.availableForAgents),
              availableForCustomers: Boolean(item.availableForCustomers),
            })),
        }))
        .filter((section) => section.detailContent.length > 0),
    }))
    .filter((category) => category.sections.length > 0);
}

export function knowledgeJsonText(result: ScanResult, state: ReviewState, lang: ClarityLang = "he") {
  return `${JSON.stringify(toAssisKnowledgeJson(knowledgeJson(result, state, lang)), null, 2)}\n`;
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
  suggestions: Array<{
    topicId: TopicId;
    qaId: string;
    answer: string;
    missing?: boolean;
    notApplicable?: boolean;
    sourceUrl?: string;
  }>,
  pages: Array<{ url: string; title: string; path: string }> = [],
  result?: ScanResult,
): ReviewState {
  const next: ReviewState = {
    ...state,
    decisions: { ...state.decisions },
    customQas: [...(state.customQas || [])],
  };
  for (const item of suggestions) {
    if (/^(tpl|kb)-/.test(item.qaId)) {
      next.customQas = (next.customQas || []).map((qa) => {
        if (qa.id !== item.qaId || qa.answer.trim()) return qa;
        const core = isCoreKbQuestion(qa);
        const source = matchPageSource(item.sourceUrl, pages);
        if (item.notApplicable && !core) {
          return {
            ...qa,
            skipped: true,
            notApplicable: true,
            answer: "",
            sourceUrl: source?.url || item.sourceUrl,
            sourceTitle: source?.pageTitle,
            sourcePath: source?.path,
          };
        }
        if (item.missing || !isUsableKbAnswer(item.answer)) return qa;
        const answer = shortDashes(item.answer);
        return {
          ...qa,
          answer,
          suggestedAnswer: answer,
          skipped: false,
          notApplicable: false,
          verdict: "pending",
          sourceUrl: source?.url || item.sourceUrl,
          sourceTitle: source?.pageTitle,
          sourcePath: source?.path,
          sourceQuote: answer.slice(0, 180),
        };
      });
      continue;
    }
    if (item.missing || item.notApplicable || !isUsableKbAnswer(item.answer)) continue;
    const topicState = next.decisions[item.topicId] || emptyTopicState();
    if (topicState.qaAnswers?.[item.qaId]?.trim()) continue;
    next.decisions[item.topicId] = {
      ...topicState,
      qaAnswers: { ...(topicState.qaAnswers || {}), [item.qaId]: shortDashes(item.answer) },
      qaSkip: { ...(topicState.qaSkip || {}), [item.qaId]: false },
    };
  }
  const corpus = [
    ...pages.map((page) => `${page.url} ${page.title} ${page.path}`),
    ...(result?.topics || []).flatMap((topic) =>
      topic.claims.map((claim) => `${claim.text} ${claim.sources.map((source) => `${source.url} ${source.pageTitle} ${source.path}`).join(" ")}`),
    ),
  ].join("\n");
  return adaptQuestionnaireToStore(next, pages, result, corpus);
}

export function adaptQuestionnaireToStore(
  state: ReviewState,
  pages: Array<{ url: string; title: string; path: string }> = [],
  result?: ScanResult,
  corpusText?: string,
): ReviewState {
  const corpus =
    corpusText ||
    [
      ...pages.map((page) => `${page.url} ${page.title} ${page.path}`),
      ...(result?.topics || []).flatMap((topic) =>
        topic.claims.map((claim) => `${claim.text} ${claim.sources.map((source) => `${source.url} ${source.pageTitle} ${source.path}`).join(" ")}`),
      ),
    ].join("\n");
  let customQas = attachMissingSources(state.customQas || [], pages, result);
  customQas = hideOptionalWithoutEvidence(customQas, corpus);
  customQas = cascadeNotApplicable(customQas);
  return { ...state, customQas };
}

function looksLikeNo(answer: string) {
  return /^(לא|אין|no)\b|לא קיימ|אין(?:\s+לנו)?\s|does not|don't offer|we do not/i.test(answer.trim());
}

function looksLikeYes(answer: string) {
  const text = answer.trim();
  if (!text || looksLikeNo(text)) return false;
  return /^(כן|yes)\b|קיימ|יש לנו|we (do|offer)|available/i.test(text) || text.length > 40;
}

function markNa(item: CustomQaItem): CustomQaItem {
  if (item.keepVisible) return item;
  if (item.answer.trim() && !looksLikeNo(item.answer)) return item;
  if (isCoreKbQuestion(item) && !isOptionalKbSection(item.detailName, item.question)) return item;
  return { ...item, skipped: true, notApplicable: true, answer: "" };
}

function hideOptionalWithoutEvidence(items: CustomQaItem[], corpus: string): CustomQaItem[] {
  const keys = new Map<string, CustomQaItem[]>();
  for (const item of items) {
    const key = `${item.groupId}::${item.detailName || ""}`;
    const list = keys.get(key) || [];
    list.push(item);
    keys.set(key, list);
  }
  const hide = new Set<string>();
  for (const list of keys.values()) {
    const sample = list[0];
    if (!sample) continue;
    const optionalSection = isOptionalKbSection(sample.detailName);
    const evidence = optionalSectionEvidence(sample.detailName, sample.question);
    const foundOnSite = evidence.test(corpus) || list.some((item) => looksLikeYes(item.answer));
    if (optionalSection && !foundOnSite) {
      for (const item of list) {
        if (!item.keepVisible) hide.add(item.id);
      }
      continue;
    }
    for (const item of list) {
      if (item.keepVisible || item.answer.trim() || item.skipped || item.notApplicable || isCoreKbQuestion(item)) continue;
      if (!isOptionalKbSection(item.detailName, item.question)) continue;
      if (!optionalSectionEvidence(item.detailName, item.question).test(corpus)) hide.add(item.id);
    }
  }
  return items.map((item) => (hide.has(item.id) ? markNa(item) : item));
}

function attachMissingSources(
  items: CustomQaItem[],
  pages: Array<{ url: string; title: string; path: string }>,
  result?: ScanResult,
): CustomQaItem[] {
  return items.map((item) => {
    if (!item.answer.trim()) return item;
    const blob = `${item.detailName || ""} ${item.question} ${item.answer}`;
    const tokens = item.answer
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .slice(0, 8);
    const fromClaim = result?.topics
      .flatMap((topic) => topic.claims)
      .find((claim) => {
        if (!claim.sources[0]) return false;
        const text = claim.text.toLowerCase();
        if (item.answer.includes(claim.text.slice(0, Math.min(36, claim.text.length)))) return true;
        return tokens.filter((word) => text.includes(word)).length >= 2;
      });
    if (fromClaim?.sources[0]) {
      const source = fromClaim.sources[0];
      return {
        ...item,
        sourceUrl: item.sourceUrl || source.url,
        sourceTitle: item.sourceTitle || source.pageTitle,
        sourcePath: item.sourcePath || source.path,
        sourceQuote: item.sourceQuote || fromClaim.text,
      };
    }
    if (item.sourceUrl) return item;
    const hint = GROUP_PAGE_HINTS[item.groupId];
    const page =
      pages.find((entry) => hint?.test(`${entry.path} ${entry.title} ${entry.url}`)) ||
      pages.find((entry) => {
        const hay = `${entry.path} ${entry.title}`.toLowerCase();
        if (/משלוח|shipping|delivery|איסוף/.test(blob)) return /shipping|delivery|משלוח/.test(hay);
        if (/החזר|החלפ|return|refund/.test(blob)) return /return|refund|החזר/.test(hay);
        if (/תשלום|payment|paypal/.test(blob)) return /payment|pay/.test(hay);
        if (/אודות|מותג|about/.test(blob)) return /about|אודות/.test(hay);
        if (/צור קשר|contact/.test(blob)) return /contact/.test(hay);
        return false;
      }) ||
      pages.find((entry) => entry.path === "/" || entry.path === "") ||
      pages[0];
    if (!page) return item;
    return {
      ...item,
      sourceUrl: page.url,
      sourceTitle: page.title,
      sourcePath: page.path,
      sourceQuote: item.sourceQuote || item.answer.slice(0, 180),
    };
  });
}

function cascadeNotApplicable(items: CustomQaItem[]): CustomQaItem[] {
  const keys = new Map<string, CustomQaItem[]>();
  for (const item of items) {
    const key = `${item.groupId}::${item.detailName || ""}`;
    const list = keys.get(key) || [];
    list.push(item);
    keys.set(key, list);
  }
  const hide = new Set<string>();
  for (const list of keys.values()) {
    const first = list[0];
    if (!first || !isOptionalKbSection(first.detailName, first.question)) continue;
    const closed = Boolean(first.notApplicable) || looksLikeNo(first.answer);
    if (!closed) continue;
    for (const item of list) {
      if (isCoreKbQuestion(item) && item.id === first.id) continue;
      if (item.answer.trim() && !looksLikeNo(item.answer) && item.id !== first.id) continue;
      hide.add(item.id);
    }
  }
  return items.map((item) => (hide.has(item.id) ? markNa(item) : item));
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
    if (!question || !answer || !isUsableKbAnswer(answer)) return [];
    const key = question.toLowerCase().replace(/\s+/g, " ");
    if (existing.has(key)) return [];
    existing.add(key);
    return [
      {
        id: `open-${Date.now()}-${index}`,
        groupId: "extra" as const,
        section: "info" as const,
        question,
        answer,
        detailName: "מידע נוסף",
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
    qaQuestions: {},
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
      qaQuestions: {},
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
      qaQuestions: { ...(current.qaQuestions || {}), ...(prev.qaQuestions || {}) },
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
