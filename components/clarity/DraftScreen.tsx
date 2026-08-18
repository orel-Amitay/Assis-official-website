"use client";

import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toggleCollectId } from "@/lib/clarity/collect-fields";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import { shortDashes } from "@/lib/clarity/text";
import { isProcessTopic } from "@/lib/clarity/focus";
import { qaBlockDone, qaBlocks, questionLabel, type QaBlock } from "@/lib/clarity/qa";
import { isScanRelevantQa, suggestionsForCustomQa } from "@/lib/clarity/suggest";
import { countQaFilters, customMatchesFilters, type QaFilter } from "@/lib/clarity/qa-filters";
import { friendlyPageLabel, textFragmentUrl } from "@/lib/clarity/source";
import { GROUPS } from "@/lib/clarity/topics";
import type {
  ClaimSource,
  CustomQaItem,
  ExtractedClaim,
  ReviewState,
  ScanResult,
  TopicGroupId,
  TopicId,
  TopicReview,
} from "@/lib/clarity/types";
import ClarityAuthForm from "./ClarityAuthForm";
import ConfettiBurst from "./ConfettiBurst";
import ClarityGuide, { ClarityHelpButton, useClarityGuide } from "./ClarityGuide";
import QaFilterBar from "./QaFilterBar";
import MaterialIcon from "./MaterialIcon";

const pill =
  "inline-flex min-h-11 items-center gap-1 rounded-full border border-black/[0.08] bg-white px-3 text-[13px] font-medium text-zinc-600 transition hover:border-black/[0.14] hover:text-foreground sm:min-h-7 sm:px-2.5 sm:text-[11px]";
const pillPrimary =
  "inline-flex min-h-11 items-center gap-1 rounded-full bg-assis-blue px-3 text-[13px] font-medium text-white transition hover:bg-assis-blue-deep sm:min-h-7 sm:px-2.5 sm:text-[11px]";
const pillGood =
  "inline-flex min-h-11 items-center gap-1 rounded-full bg-emerald-50 px-3 text-[13px] font-medium text-emerald-800 ring-1 ring-emerald-200/80 transition hover:bg-emerald-100 sm:min-h-7 sm:px-2.5 sm:text-[11px]";
const pillMuted =
  "inline-flex min-h-11 items-center gap-1 rounded-full bg-zinc-200 px-3 text-[13px] font-medium text-zinc-500 transition hover:bg-zinc-300 sm:min-h-7 sm:px-2.5 sm:text-[11px]";
const pillWarn =
  "inline-flex min-h-11 items-center gap-1 rounded-full bg-orange-50 px-3 text-[13px] font-medium text-orange-900 ring-1 ring-orange-200 transition hover:bg-orange-100 sm:min-h-7 sm:px-2.5 sm:text-[11px]";
const fillCard =
  "rounded-[1.15rem] bg-orange-50/90 px-4 py-4 ring-1 ring-orange-200";
const naCard =
  "rounded-[1.15rem] bg-zinc-100/80 px-4 py-4 ring-1 ring-zinc-200";
const questionBox =
  "mt-1 box-border min-h-[5.5rem] w-full min-w-0 max-w-full resize-y break-words rounded-[1.1rem] border border-assis-blue/20 bg-white px-4 py-3 text-start text-[16px] leading-relaxed text-foreground outline-none [overflow-wrap:anywhere] [unicode-bidi:plaintext] focus:border-assis-blue/40 focus:ring-4 focus:ring-assis-blue/10 sm:min-h-[4.5rem] sm:text-[15px]";
const answerBox =
  "mt-1 box-border min-h-[12rem] w-full min-w-0 max-w-full resize-y break-words rounded-[1.1rem] border border-assis-blue/20 bg-white px-4 py-3.5 text-start text-[16px] leading-relaxed text-foreground outline-none [overflow-wrap:anywhere] [unicode-bidi:plaintext] focus:border-assis-blue/40 focus:ring-4 focus:ring-assis-blue/10 sm:min-h-[9rem] sm:text-[15px]";
const answerText =
  "mt-1 min-h-[3rem] w-full min-w-0 max-w-full break-words whitespace-pre-wrap text-start text-[16px] leading-relaxed text-foreground [overflow-wrap:anywhere] [unicode-bidi:plaintext] sm:text-[14px]";

function sourceForCustomQa(
  item: CustomQaItem,
  suggestions: ExtractedClaim[],
  result: ScanResult,
): { claim: ExtractedClaim; source: ClaimSource; question?: string } | null {
  const suggested = suggestions[0];
  const suggestedSource = suggested?.sources[0];
  const page =
    result.pagesScanned.find((entry) => entry.url === item.sourceUrl) ||
    result.pagesScanned.find((entry) => entry.path === item.sourcePath) ||
    result.pagesScanned.find((entry) => entry.path === "/" || entry.path === "") ||
    result.pagesScanned[0];
  const url = item.sourceUrl || suggestedSource?.url || page?.url || result.storeUrl;
  if (!url) return null;
  const source: ClaimSource = {
    url,
    pageTitle: item.sourceTitle || suggestedSource?.pageTitle || page?.title || url,
    path: item.sourcePath || suggestedSource?.path || page?.path || "/",
    excerpt: suggestedSource?.excerpt || item.sourceQuote || item.answer,
  };
  const quote = [suggested?.text, suggestedSource?.excerpt, item.sourceQuote, item.answer]
    .map((value) => String(value || "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
  return {
    claim: {
      id: suggested?.id || `qa-src-${item.id}`,
      topicId: suggested?.topicId || "about",
      text: quote.slice(0, 400),
      sources: [source],
    },
    source: {
      ...source,
      excerpt: suggestedSource?.excerpt || suggested?.text || item.sourceQuote || item.answer,
    },
    question: item.question,
  };
}

function SourceLinks({
  lang,
  claim,
  source,
  question,
  onOpenSource,
}: {
  lang: ClarityLang;
  claim: ExtractedClaim;
  source: ClaimSource;
  question?: string;
  onOpenSource: (value: { claim: ExtractedClaim; source: ClaimSource; question?: string }) => void;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const label = friendlyPageLabel(source, he ? "עמוד הבית" : "Home");
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <a href={source.url} target="_blank" rel="noopener noreferrer" className={pill}>
        <MaterialIcon name="link" className="text-[14px] text-zinc-500" />
        {label}
      </a>
      <button type="button" onClick={() => onOpenSource({ claim, source, question })} className={pill}>
        <MaterialIcon name="my_location" className="text-[14px] text-zinc-500" />
        {t.seeExactPlace}
      </button>
    </div>
  );
}

function customDone(item: CustomQaItem) {
  return Boolean(item.skipped || item.notApplicable || item.verdict === "approved");
}

function customNeedsFill(item: CustomQaItem) {
  if (item.skipped || item.notApplicable) return false;
  return !item.answer.trim() || item.verdict === "rejected";
}

function qaNeedsFill(block: QaBlock) {
  if (block.skipped) return false;
  if (Object.values(block.decisions).some((decision) => decision === "approved")) return false;
  const openClaim = block.claims.some((claim) => block.decisions[claim.id] !== "rejected");
  return !block.answer.trim() && !openClaim;
}

function CategoryScanButton({
  lang,
  scanning,
  disabled,
  onClick,
}: {
  lang: ClarityLang;
  scanning: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const t = COPY[lang];
  return (
    <button type="button" onClick={onClick} disabled={disabled || scanning} className={pill}>
      <MaterialIcon name="refresh" className="text-[14px] text-zinc-500" />
      {scanning ? t.categoryScanning : t.categoryScan}
    </button>
  );
}

function categoryNeedLabel(lang: ClarityLang, done: number, total: number) {
  const left = Math.max(0, total - done);
  if (total > 0 && left === 0) {
    return `${done}/${total} · ${COPY[lang].categoryDoneAll}`;
  }
  return COPY[lang].categoryNeed
    .replace("{done}", String(done))
    .replace("{total}", String(total))
    .replace("{left}", String(left));
}

function CategoryNavButton({
  lang,
  title,
  done,
  total,
  selected,
  compact = false,
  onClick,
}: {
  lang: ClarityLang;
  title: string;
  done: number;
  total: number;
  selected: boolean;
  compact?: boolean;
  onClick: () => void;
}) {
  const left = Math.max(0, total - done);
  const complete = total > 0 && left === 0;
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`shrink-0 rounded-full px-3 py-2.5 text-[13px] font-medium transition sm:px-3.5 sm:py-2 ${
          selected
            ? "bg-assis-blue text-white"
            : complete
              ? "bg-emerald-50 text-emerald-800"
              : "bg-white/80 text-muted-foreground hover:text-foreground"
        }`}
      >
        {complete ? "✓ " : ""}
        {title}
        {total ? (
          <span className={`ms-1.5 text-[10px] font-medium ${selected ? "text-white/80" : "text-zinc-400"}`}>
            {done}/{total}
          </span>
        ) : null}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-start transition ${
        selected
          ? "bg-assis-blue-light text-assis-blue-deep shadow-sm"
          : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
      }`}
    >
      <span className="min-w-0 text-[13px] font-medium leading-snug">{title}</span>
      {total ? (
        <span className={`shrink-0 text-[11px] ${selected ? "text-assis-blue-deep/70" : "text-zinc-400"}`}>
          {complete ? "✓" : `${done}/${total}`}
        </span>
      ) : null}
    </button>
  );
}

function scrollAppToId(id: string, offset = 120) {
  const el = document.getElementById(id);
  const root = document.getElementById("app-scroll");
  if (!el) return;
  if (root) {
    const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - offset;
    root.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function detailGroups(items: CustomQaItem[], fallback: string) {
  const order: string[] = [];
  const map = new Map<string, CustomQaItem[]>();
  for (const item of items) {
    const name = item.detailName?.trim() || fallback;
    if (!map.has(name)) {
      order.push(name);
      map.set(name, []);
    }
    map.get(name)!.push(item);
  }
  return order.map((detailName) => ({ detailName, items: map.get(detailName)! }));
}

function groupProcessBlocks(rows: { topic: TopicReview; block: QaBlock }[]) {
  const order: string[] = [];
  const map = new Map<string, { topic: TopicReview; blocks: { topic: TopicReview; block: QaBlock }[] }>();
  for (const row of rows) {
    if (!map.has(row.topic.id)) {
      order.push(row.topic.id);
      map.set(row.topic.id, { topic: row.topic, blocks: [] });
    }
    map.get(row.topic.id)!.blocks.push(row);
  }
  return order.map((id) => map.get(id)!);
}

type SlideItem =
  | {
      kind: "qa";
      key: string;
      groupId: TopicGroupId;
      topic: TopicReview;
      block: QaBlock;
      section: "info" | "process";
    }
  | {
      kind: "custom";
      key: string;
      groupId: TopicGroupId;
      item: CustomQaItem;
      section: "info" | "process";
    };

function itemDomId(slide: SlideItem) {
  return slide.kind === "custom"
    ? `clarity-item-${slide.item.id}`
    : `clarity-item-${slide.topic.id}-${slide.block.def.id}`;
}

export default function DraftScreen({
  lang,
  result,
  state,
  savedAt,
  cloudSave = "idle",
  onPickQa,
  onRejectQa,
  onQaAnswer,
  onQaQuestion,
  onSaveEdit,
  onSkipQa,
  onUnskipQa,
  onAddCustomQa,
  onUpdateCustomQa,
  onToggleQaCollect,
  signedIn,
  onSaveDraft,
  onBack,
  onRescan,
  onCategoryScan,
  categoryScanId,
  categoryScanNote,
}: {
  lang: ClarityLang;
  result: ScanResult;
  state: ReviewState;
  savedAt?: string | null;
  cloudSave?: "idle" | "saving" | "saved" | "error";
  signedIn?: boolean;
  onPickQa: (topicId: TopicId, qaId: string, claimId: string) => void;
  onRejectQa: (topicId: TopicId, qaId: string, claimId: string) => void;
  onQaAnswer: (topicId: TopicId, qaId: string, text: string) => void;
  onQaQuestion: (topicId: TopicId, qaId: string, text: string) => void;
  onSaveEdit: (topicId: TopicId, qaId: string, text: string, claimId?: string) => void;
  onSkipQa: (topicId: TopicId, qaId: string) => void;
  onUnskipQa: (topicId: TopicId, qaId: string) => void;
  onAddCustomQa: (groupId: TopicGroupId, section: CustomQaItem["section"], detailName?: string) => void;
  onUpdateCustomQa: (id: string, patch: Partial<CustomQaItem>) => void;
  onToggleQaCollect: (topicId: TopicId, qaId: string, fieldId: string) => void;
  onSaveDraft: () => void;
  onBack?: () => void;
  onRescan: () => void;
  onCategoryScan: (groupId: TopicGroupId) => void;
  categoryScanId?: TopicGroupId | null;
  categoryScanNote?: string;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const guide = useClarityGuide();
  const [openSource, setOpenSource] = useState<{
    claim: ExtractedClaim;
    source: ClaimSource;
    question?: string;
  } | null>(null);
  const [pendingTrue, setPendingTrue] = useState<{
    topicId: TopicId;
    qaId: string;
    claimId: string;
    currentText: string;
    nextText: string;
  } | null>(null);
  const [sectionTab, setSectionTab] = useState<"info" | "process">("info");
  const [viewMode, setViewMode] = useState<"scroll" | "slides">("scroll");
  const [qIndex, setQIndex] = useState(0);
  const [confetti, setConfetti] = useState({ fire: 0, big: false });
  const [celebrate, setCelebrate] = useState<"section" | "all" | "">("");
  const celebrated = useRef({ all: false, ready: false });
  const prevSection = useRef({ id: "", done: false });
  const touchStart = useRef<{ x: number; y: number } | null>(null);


  const [showNa, setShowNa] = useState(false);
  const [filters, setFilters] = useState<QaFilter[]>([]);
  const [pendingScanGroup, setPendingScanGroup] = useState<TopicGroupId | null>(null);

  const categories = useMemo(() => {
    return GROUPS.map((group) => {
      const topics = result.topics.filter((topic) => topic.group === group.id);
      const allBlocks = topics.flatMap((topic) =>
        qaBlocks(topic, state).map((block) => ({ topic, block })),
      );
      const infoBlocks = allBlocks.filter(({ topic }) => !isProcessTopic(topic.id));
      const processBlocks = allBlocks.filter(({ topic }) => isProcessTopic(topic.id));
      const customInfo = (state.customQas || []).filter((item) => item.groupId === group.id && item.section !== "process");
      const customProcess = (state.customQas || []).filter(
        (item) => item.groupId === group.id && item.section === "process",
      );
      const customAll = (state.customQas || []).filter((item) => item.groupId === group.id);
      const relevantInfo = customInfo.filter((item) => isScanRelevantQa(item, result, showNa));
      const includeProcess = Boolean(result.importedKb || result.demo);
      const visible =
        relevantInfo.length + (includeProcess ? processBlocks.length + customProcess.length : 0);
      const done =
        relevantInfo.filter(customDone).length +
        (includeProcess
          ? processBlocks.filter((item) => qaBlockDone(item.block)).length + customProcess.filter(customDone).length
          : 0);
      return {
        ...group,
        topics,
        infoBlocks,
        processBlocks,
        customInfo,
        customProcess,
        customAll,
        relevantInfo,
        includeProcess,
        visible,
        done,
      };
    });
  }, [result, state, showNa]);

  const [activeGroup, setActiveGroup] = useState<TopicGroupId>(
    () => categories.find((group) => group.visible > 0)?.id || "brand",
  );
  const active = categories.find((group) => group.id === activeGroup) || categories[0];
  const allSlides = useMemo(() => {
    const items: SlideItem[] = [];
    for (const group of categories) {
      for (const item of [...group.relevantInfo, ...(group.includeProcess ? group.customProcess : [])]) {
        if (filters.length && !customMatchesFilters(item, filters)) continue;
        items.push({
          kind: "custom",
          key: `custom:${item.id}`,
          groupId: group.id,
          item,
          section: item.section,
        });
      }
      if (filters.length) continue;
      for (const row of group.includeProcess ? group.processBlocks : []) {
        items.push({
          kind: "qa",
          key: `qa:${row.topic.id}:${row.block.def.id}`,
          groupId: group.id,
          topic: row.topic,
          block: row.block,
          section: "process",
        });
      }
    }
    return items;
  }, [categories, filters]);
  const slideCount = allSlides.length;
  const safeIndex = slideCount === 0 ? 0 : Math.min(qIndex, slideCount - 1);
  const currentSlide = allSlides[safeIndex];
  const currentGroup =
    categories.find((group) => group.id === currentSlide?.groupId) || active;
  const progressTotal = categories.reduce((sum, group) => sum + group.visible, 0);
  const progressDone = categories.reduce((sum, group) => sum + group.done, 0);
  const progressLeft = Math.max(0, progressTotal - progressDone);
  const progressPct = progressTotal === 0 ? 0 : Math.round((progressDone / progressTotal) * 100);
  const sectionComplete = Boolean(active && active.visible > 0 && active.done >= active.visible);
  const allComplete = progressTotal > 0 && progressDone >= progressTotal;
  const infoItems = active?.relevantInfo || [];
  const processItems = active?.customProcess || [];
  const showProcessTab =
    Boolean(active?.includeProcess) &&
    active?.id !== "extra" &&
    ((processItems.length || 0) > 0 || (active?.processBlocks.length || 0) > 0);
  const allQaItems = useMemo(
    () => categories.flatMap((group) => [...group.relevantInfo, ...(group.includeProcess ? group.customProcess : [])]),
    [categories],
  );
  const filterCounts = useMemo(() => countQaFilters(allQaItems), [allQaItems]);
  const filtering = filters.length > 0;
  const matchedCategories = useMemo(() => {
    if (!filtering) return [];
    return categories
      .map((group) => ({
        ...group,
        matchedItems: [...group.relevantInfo, ...(group.includeProcess ? group.customProcess : [])].filter((item) =>
          customMatchesFilters(item, filters),
        ),
      }))
      .filter((group) => group.matchedItems.length > 0);
  }, [categories, filters, filtering]);
  const groupsToShow = filtering
    ? matchedCategories
    : active
      ? [
          {
            ...active,
            matchedItems: [...active.relevantInfo, ...(active.includeProcess ? active.customProcess : [])],
          },
        ]
      : [];
  const navCategories = filtering
    ? matchedCategories
    : categories.filter((group) => group.visible > 0 || group.id === "extra");
  const categoryItems = [...infoItems, ...(active?.includeProcess ? processItems : [])];
  const hasVisible =
    categoryItems.length > 0 || Boolean(active?.includeProcess && (active.processBlocks.length || 0) > 0);

  useEffect(() => {
    const saved = window.localStorage.getItem("clarity-view");
    if (saved === "scroll" || saved === "slides") setViewMode(saved);
  }, []);

  useEffect(() => {
    if (qIndex > 0 && qIndex > Math.max(0, slideCount - 1)) {
      setQIndex(Math.max(0, slideCount - 1));
    }
  }, [qIndex, slideCount]);

  useEffect(() => {
    setQIndex(0);
  }, [filters]);

  useEffect(() => {
    if (viewMode !== "slides" || allSlides.length === 0) return;
    const open = allSlides.findIndex((item) =>
      item.kind === "qa" ? !qaBlockDone(item.block) : !customDone(item.item),
    );
    if (open < 0) return;
    setQIndex(open);
    setActiveGroup(allSlides[open].groupId);
    // Only when entering slides — not after every answer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  useEffect(() => {
    if (!celebrated.current.ready) {
      celebrated.current.ready = true;
      celebrated.current.all = allComplete;
      prevSection.current = { id: active?.id || "", done: sectionComplete };
      return;
    }
    if (allComplete && !celebrated.current.all) {
      celebrated.current.all = true;
      prevSection.current = { id: active?.id || "", done: true };
      setCelebrate("all");
      setConfetti((prev) => ({ fire: prev.fire + 1, big: true }));
      return;
    }
    if (
      active &&
      prevSection.current.id === active.id &&
      sectionComplete &&
      !prevSection.current.done
    ) {
      setCelebrate("section");
      setConfetti((prev) => ({ fire: prev.fire + 1, big: false }));
    }
    prevSection.current = { id: active?.id || "", done: sectionComplete };
  }, [allComplete, sectionComplete, active?.id]);

  useEffect(() => {
    if (!celebrate) return;
    const timer = window.setTimeout(() => setCelebrate(""), 2800);
    return () => window.clearTimeout(timer);
  }, [celebrate]);

  function setMode(next: "scroll" | "slides") {
    setViewMode(next);
    window.localStorage.setItem("clarity-view", next);
  }

  function tryPickQa(topicId: TopicId, qaId: string, claimId: string, block: QaBlock) {
    if (block.decisions[claimId] === "approved") return;
    const current = block.claims.find(
      (claim) =>
        claim.id !== claimId &&
        (block.decisions[claim.id] === "approved" ||
          (Boolean(block.answer.trim()) && claim.text === block.answer.trim())),
    );
    const next = block.claims.find((claim) => claim.id === claimId);
    if (current && next) {
      setPendingTrue({
        topicId,
        qaId,
        claimId,
        currentText: current.text,
        nextText: next.text,
      });
      return;
    }
    onPickQa(topicId, qaId, claimId);
  }

  function goToGroup(id: TopicGroupId) {
    setActiveGroup(id);
    const group = categories.find((item) => item.id === id);
    const hasInfo = (group?.relevantInfo.length || 0) > 0;
    const hasProcess =
      id !== "extra" && ((group?.customProcess.length || 0) > 0 || (group?.processBlocks.length || 0) > 0);
    const nextTab = !hasInfo && hasProcess ? "process" : "info";
    setSectionTab(nextTab);
    if (viewMode === "slides") {
      const fill = allSlides.findIndex(
        (item) => item.groupId === id && (item.kind === "qa" ? qaNeedsFill(item.block) : customNeedsFill(item.item)),
      );
      const missing = allSlides.findIndex(
        (item) =>
          item.groupId === id &&
          (item.kind === "qa" ? !qaBlockDone(item.block) : !customDone(item.item)),
      );
      const next = allSlides.findIndex(
        (item) => item.groupId === id && (nextTab === "process" ? item.section === "process" : item.section !== "process"),
      );
      const fallback = allSlides.findIndex((item) => item.groupId === id);
      const idx = fill >= 0 ? fill : missing >= 0 ? missing : next >= 0 ? next : fallback;
      if (idx >= 0) setQIndex(idx);
    }
  }

  function requestGoToGroup(id: TopicGroupId) {
    if (filtering) {
      setActiveGroup(id);
      window.setTimeout(() => scrollAppToId(`clarity-group-${id}`), 40);
      return;
    }
    if (id === (viewMode === "slides" ? currentGroup?.id : active?.id)) return;
    onSaveDraft();
    goToGroup(id);
  }

  function goToNextMissing() {
    const group = viewMode === "slides" ? currentGroup : active;
    if (!group) return;
    const rows = allSlides
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.groupId === group.id);
    const fill = rows.filter(({ item }) =>
      item.kind === "qa" ? qaNeedsFill(item.block) : customNeedsFill(item.item),
    );
    const missing = fill.length
      ? fill
      : rows.filter(({ item }) => (item.kind === "qa" ? !qaBlockDone(item.block) : !customDone(item.item)));
    if (!missing.length) return;
    const next =
      viewMode === "slides"
        ? missing.find((row) => row.index > safeIndex) || missing[0]
        : missing.find((row) => {
            const el = document.getElementById(itemDomId(row.item));
            return !el || el.getBoundingClientRect().top > 140;
          }) || missing[0];
    const slide = next.item;
    if (viewMode === "slides") {
      setQIndex(next.index);
      return;
    }
    const processSlide = slide.kind === "qa" || (slide.kind === "custom" && slide.section === "process");
    if (processSlide && showProcessTab) setSectionTab("process");
    else setSectionTab("info");
    const id = itemDomId(slide);
    window.setTimeout(() => scrollAppToId(id), 60);
  }

  function goSlide(step: number) {
    if (slideCount === 0) return;
    const next = Math.min(slideCount - 1, Math.max(0, safeIndex + step));
    if (next === safeIndex) return;
    setQIndex(next);
    const slide = allSlides[next];
    if (slide) {
      setActiveGroup(slide.groupId);
      setSectionTab(slide.section === "process" ? "process" : "info");
    }
  }

  function ignoreSwipeTarget(target: EventTarget | null) {
    return Boolean(
      target instanceof Element &&
        target.closest("button, textarea, input, a, select, label, [contenteditable='true']"),
    );
  }

  function onSlideTouchStart(e: TouchEvent) {
    if (viewMode !== "slides") return;
    const focused = document.activeElement;
    if (focused instanceof HTMLTextAreaElement || focused instanceof HTMLInputElement || ignoreSwipeTarget(e.target)) {
      touchStart.current = null;
      return;
    }
    const point = e.changedTouches[0];
    if (!point) return;
    touchStart.current = { x: point.clientX, y: point.clientY };
  }

  function onSlideTouchEnd(e: TouchEvent) {
    if (viewMode !== "slides" || !touchStart.current) return;
    const point = e.changedTouches[0];
    const start = touchStart.current;
    touchStart.current = null;
    if (!point) return;
    const dx = point.clientX - start.x;
    const dy = point.clientY - start.y;
    if (Math.abs(dx) < 96) return;
    if (Math.abs(dy) > 40 && Math.abs(dx) < Math.abs(dy) * 1.6) return;
    goSlide(he ? (dx > 0 ? 1 : -1) : dx < 0 ? 1 : -1);
  }

  const sectionInner = (
            <>
              {groupsToShow.map((group) => {
                const items = group.matchedItems;
                return (
                  <div key={group.id} id={`clarity-group-${group.id}`} className="space-y-5">
                    <div>
                      <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                        {he ? group.titleHe : group.title}
                      </h2>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        {group.visible > 0 ? (
                          <p className="text-[13px] text-zinc-500">
                            {filtering
                              ? `${items.length}`
                              : categoryNeedLabel(lang, group.done, group.visible)}
                          </p>
                        ) : (
                          <span />
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          {!filtering && group.visible > 0 && group.done < group.visible ? (
                            <button type="button" onClick={goToNextMissing} className={pillPrimary}>
                              {t.jumpNextMissing}
                            </button>
                          ) : null}
                          <CategoryScanButton
                            lang={lang}
                            scanning={categoryScanId === group.id}
                            disabled={Boolean(categoryScanId)}
                            onClick={() => setPendingScanGroup(group.id)}
                          />
                        </div>
                      </div>
                      {categoryScanNote && (viewMode === "scroll" || currentGroup?.id === group.id) ? (
                        <p className="mt-3 rounded-[1.1rem] bg-assis-blue-light px-4 py-2.5 text-[13px] leading-relaxed text-assis-blue-deep">
                          {categoryScanNote}
                        </p>
                      ) : null}
                    </div>

                    {detailGroups(items, t.addedQuestions).map(({ detailName, items: detailItems }) => (
                      <section
                        key={`${group.id}-${detailName}`}
                        className="min-w-0 overflow-hidden rounded-[1.35rem] border border-black/[0.06] bg-white"
                      >
                        <header className="border-b border-black/[0.05] px-4 py-3 sm:px-5">
                          <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
                            {detailName}
                          </h3>
                        </header>
                        <div className="min-w-0 space-y-4 px-4 py-4 sm:px-5">
                          {detailItems.map((item) => (
                            <div
                              key={item.id}
                              id={`clarity-item-${item.id}`}
                              className={
                                item.skipped || item.notApplicable
                                  ? naCard
                                  : customNeedsFill(item)
                                    ? fillCard
                                    : "border-t border-black/[0.05] pt-4 first:border-t-0 first:pt-0"
                              }
                            >
                              <CustomQaBlock
                                lang={lang}
                                item={item}
                                result={result}
                                suggestions={suggestionsForCustomQa(item, result)}
                                onChange={(patch) => onUpdateCustomQa(item.id, patch)}
                                onToggleCollect={(fieldId) =>
                                  onUpdateCustomQa(item.id, {
                                    collectFields: toggleCollectId(item.collectFields, fieldId),
                                  })
                                }
                                onOpenSource={setOpenSource}
                              />
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}

                    {!filtering && group.includeProcess
                      ? groupProcessBlocks(group.processBlocks || []).map(({ topic, blocks }) => (
                          <section
                            key={topic.id}
                            className="min-w-0 overflow-hidden rounded-[1.35rem] border border-black/[0.06] bg-white"
                          >
                            <header className="border-b border-black/[0.05] px-4 py-3 sm:px-5">
                              <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
                                {he ? topic.titleHe : topic.title}
                              </h3>
                            </header>
                            <div className="min-w-0 space-y-4 px-4 py-4 sm:px-5">
                              {blocks.map(({ block }) => (
                                <div
                                  key={`${topic.id}-${block.def.id}`}
                                  id={`clarity-item-${topic.id}-${block.def.id}`}
                                  className={
                                    block.skipped ? naCard : qaNeedsFill(block) ? fillCard : ""
                                  }
                                >
                                  <QuestionBlock
                                    lang={lang}
                                    block={block}
                                    onTrue={(claimId) => tryPickQa(topic.id, block.def.id, claimId, block)}
                                    onFalse={(claimId) => onRejectQa(topic.id, block.def.id, claimId)}
                                    onAnswer={(text) => onQaAnswer(topic.id, block.def.id, text)}
                                    onQuestion={(text) => onQaQuestion(topic.id, block.def.id, text)}
                                    onSaveEdit={(text, claimId) => onSaveEdit(topic.id, block.def.id, text, claimId)}
                                    onSkip={() => onSkipQa(topic.id, block.def.id)}
                                    onUnskip={() => onUnskipQa(topic.id, block.def.id)}
                                    onToggleCollect={(fieldId) => onToggleQaCollect(topic.id, block.def.id, fieldId)}
                                    onOpenSource={setOpenSource}
                                  />
                                </div>
                              ))}
                            </div>
                          </section>
                        ))
                      : null}

                    {!filtering ? (
                      <button
                        type="button"
                        onClick={() => onAddCustomQa(group.id, "info")}
                        className={pillPrimary}
                      >
                        <MaterialIcon name="add" className="text-[14px]" />
                        {t.addQuestion}
                      </button>
                    ) : null}
                  </div>
                );
              })}

              {filtering && matchedCategories.length === 0 ? (
                <p className="text-[14px] text-muted-foreground">{t.filterEmpty}</p>
              ) : null}

              {!filtering && !hasVisible ? (
                <p className="text-[14px] text-muted-foreground">
                  {(state.customQas || []).some(
                    (item) => item.groupId === active?.id && (item.skipped || item.notApplicable),
                  )
                    ? t.emptyOptionalCategory
                    : t.emptyCategory}
                </p>
              ) : null}
            </>
  );

  return (
    <main className="mx-auto max-w-6xl px-3 pb-[max(8rem,calc(env(safe-area-inset-bottom)+6.5rem))] pt-2 sm:px-8 sm:pb-28 sm:pt-8">
      <ConfettiBurst fire={confetti.fire} big={confetti.big} />
      <div className="mb-2 flex items-center justify-between gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="min-w-0 truncate text-[12px] font-medium text-zinc-500 transition hover:text-foreground"
          >
            {t.backToDrafts}
          </button>
        ) : (
          <span />
        )}
        <p className="max-w-[45%] truncate text-[11px] text-zinc-400">{result.storeName}</p>
      </div>

      <div className="sticky top-0 z-30 -mx-3 border-b border-black/[0.05] bg-[#f7f8fa] px-3 py-2 sm:mx-0 sm:rounded-[1.3rem] sm:border sm:px-3 sm:py-2.5 [transform:translateZ(0)]">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[11px] font-semibold text-foreground sm:text-[12px]">
                {t.progressDone.replace("{done}", String(progressDone)).replace("{total}", String(progressTotal))}
              </p>
              <p className="shrink-0 text-[10px] font-medium text-zinc-500 sm:text-[11px]">
                {progressLeft > 0 ? t.progressLeft.replace("{n}", String(progressLeft)) : t.allComplete}
              </p>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-200/80">
              <div
                className="h-full rounded-full bg-assis-blue transition-[width] duration-200 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {cloudSave === "saving" || savedAt || cloudSave === "saved" ? (
              <p
                className={`mt-1 truncate text-[10px] font-medium ${
                  cloudSave === "saving" ? "text-assis-blue" : "text-emerald-700"
                }`}
              >
                {cloudSave === "saving"
                  ? t.liveSaving
                  : t.draftSavedAt.replace(
                      "{time}",
                      new Date(savedAt as string).toLocaleTimeString(he ? "he-IL" : "en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    )}
              </p>
            ) : signedIn ? (
              <p className="mt-1 truncate text-[10px] font-medium text-emerald-700">{t.liveSaved}</p>
            ) : null}
          </div>
          <div className="inline-flex shrink-0 rounded-full bg-white p-0.5 ring-1 ring-black/[0.06]">
            <button
              type="button"
              onClick={() => setMode("scroll")}
              className={`rounded-full px-2 py-1 text-[10px] font-semibold transition sm:px-2.5 sm:text-[11px] ${
                viewMode === "scroll" ? "bg-assis-blue text-white" : "text-zinc-500"
              }`}
            >
              {t.viewScroll}
            </button>
            <button
              type="button"
              onClick={() => setMode("slides")}
              className={`rounded-full px-2 py-1 text-[10px] font-semibold transition sm:px-2.5 sm:text-[11px] ${
                viewMode === "slides" ? "bg-assis-blue text-white" : "text-zinc-500"
              }`}
            >
              {t.viewSlides}
            </button>
          </div>
          <QaFilterBar lang={lang} selected={filters} counts={filterCounts} onChange={setFilters} />
          <ClarityHelpButton label={t.guideCta} onClick={guide.show} />
        </div>
      </div>

      <AnimatePresence>
        {celebrate ? (
          <motion.p
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 rounded-full bg-emerald-50 px-4 py-2 text-center text-[13px] font-semibold text-emerald-800"
          >
            {celebrate === "all" ? t.allComplete : t.sectionComplete}
          </motion.p>
        ) : null}
      </AnimatePresence>
      {!signedIn ? (
        <div className="mt-4 rounded-[1.3rem] border border-amber-200 bg-amber-50 p-4">
          <p className="mb-3 text-[13px] font-semibold text-amber-950">{t.draftSavedHint}</p>
          <ClarityAuthForm lang={lang} compact />
        </div>
      ) : null}

      <div className={`mt-3 ${viewMode === "slides" ? "" : "lg:hidden"} -mx-4 px-4 sm:mx-0 sm:mt-4 sm:px-0`}>
        <div className="flex gap-1.5 overflow-x-auto pb-1 pe-6 no-scrollbar">
          {navCategories.map((group) => (
              <CategoryNavButton
                key={group.id}
                lang={lang}
                title={he ? group.titleHe : group.title}
                done={group.done}
                total={group.visible}
                selected={(viewMode === "slides" ? currentGroup?.id : active?.id) === group.id}
                compact
                onClick={() => requestGoToGroup(group.id)}
              />
            ))}
        </div>
        {(viewMode === "slides" ? currentGroup : active) ? (
          <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowNa((value) => !value)}
            className="inline-flex h-8 items-center rounded-full border border-black/[0.08] bg-white px-3 text-[11px] font-medium text-zinc-600 hover:text-foreground"
          >
            {showNa ? t.hideIrrelevant : t.showIrrelevant}
          </button>
          </div>
        ) : null}
      </div>

      <div className="mt-6 lg:flex lg:items-start lg:gap-8">
        <nav className={`hidden w-64 shrink-0 ${viewMode === "scroll" ? "lg:block" : ""}`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            {t.categoriesNav}
          </p>
          <div className="sticky top-28 mt-3 space-y-1">
            {navCategories.map((group) => (
                <CategoryNavButton
                  key={group.id}
                  lang={lang}
                  title={he ? group.titleHe : group.title}
                  done={group.done}
                  total={group.visible}
                  selected={active?.id === group.id}
                  onClick={() => requestGoToGroup(group.id)}
                />
              ))}
          </div>
        </nav>

        <div className="min-w-0 flex-1">
          <article
            onTouchStart={onSlideTouchStart}
            onTouchEnd={onSlideTouchEnd}
            className="touch-pan-y min-w-0 overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03),0_16px_40px_-24px_rgba(16,24,40,0.18)]"
          >
              <div className="hidden overflow-x-auto border-b border-black/[0.04] px-4 py-3 text-[12px] text-zinc-400 sm:block sm:px-5" dir="ltr">
                {result.storeUrl.replace(/\/$/, "")}
              </div>
              {viewMode === "slides" ? (
                <div key={currentSlide?.key || "empty"} className="clarity-slide min-w-0 space-y-4 px-4 py-5 sm:px-7 sm:py-8">
                  {currentSlide ? (
                    <>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-assis-blue/80">
                          {he ? currentGroup?.titleHe : currentGroup?.title}
                        </p>
                        {currentGroup ? (
                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                            {filtering ? (
                              <p className="text-[13px] text-zinc-500">{slideCount}</p>
                            ) : currentGroup.visible > 0 ? (
                              <p className="text-[13px] text-zinc-500">
                                {categoryNeedLabel(lang, currentGroup.done, currentGroup.visible)}
                              </p>
                            ) : (
                              <span />
                            )}
                            <div className="flex flex-wrap items-center gap-2">
                              {!filtering && currentGroup.visible > 0 ? (
                                currentGroup.done < currentGroup.visible ? (
                                  <button type="button" onClick={goToNextMissing} className={pillPrimary}>
                                    {t.jumpNextMissing}
                                  </button>
                                ) : (
                                  <p className="text-[12px] font-semibold text-emerald-700">{t.categoryDoneAll}</p>
                                )
                              ) : filtering && slideCount > 0 ? (
                                <button type="button" onClick={goToNextMissing} className={pillPrimary}>
                                  {t.jumpNextMissing}
                                </button>
                              ) : null}
                              <CategoryScanButton
                                lang={lang}
                                scanning={categoryScanId === currentGroup.id}
                                disabled={Boolean(categoryScanId)}
                                onClick={() => setPendingScanGroup(currentGroup.id)}
                              />
                            </div>
                          </div>
                        ) : null}
                        {categoryScanNote ? (
                          <p className="mt-3 rounded-[1.1rem] bg-assis-blue-light px-4 py-2.5 text-[13px] leading-relaxed text-assis-blue-deep">
                            {categoryScanNote}
                          </p>
                        ) : null}
                        <h2 className="font-display mt-3 text-[1.25rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[1.45rem]">
                          {currentSlide.kind === "qa"
                            ? he
                              ? currentSlide.topic.titleHe
                              : currentSlide.topic.title
                            : currentSlide.item.detailName || t.addedQuestions}
                        </h2>
                      </div>
                      <div
                        className={
                          currentSlide.kind === "qa"
                            ? currentSlide.block.skipped
                              ? naCard
                              : qaNeedsFill(currentSlide.block)
                                ? fillCard
                                : ""
                            : currentSlide.item.skipped || currentSlide.item.notApplicable
                              ? naCard
                              : customNeedsFill(currentSlide.item)
                                ? fillCard
                                : ""
                        }
                      >
                      {currentSlide.kind === "qa" ? (
                        <QuestionBlock
                          lang={lang}
                          block={currentSlide.block}
                          onTrue={(claimId) =>
                            tryPickQa(
                              currentSlide.topic.id,
                              currentSlide.block.def.id,
                              claimId,
                              currentSlide.block,
                            )
                          }
                          onFalse={(claimId) => onRejectQa(currentSlide.topic.id, currentSlide.block.def.id, claimId)}
                          onAnswer={(text) => onQaAnswer(currentSlide.topic.id, currentSlide.block.def.id, text)}
                          onQuestion={(text) =>
                            onQaQuestion(currentSlide.topic.id, currentSlide.block.def.id, text)
                          }
                          onSaveEdit={(text, claimId) =>
                            onSaveEdit(currentSlide.topic.id, currentSlide.block.def.id, text, claimId)
                          }
                          onSkip={() => onSkipQa(currentSlide.topic.id, currentSlide.block.def.id)}
                          onUnskip={() => onUnskipQa(currentSlide.topic.id, currentSlide.block.def.id)}
                          onToggleCollect={(fieldId) =>
                            onToggleQaCollect(currentSlide.topic.id, currentSlide.block.def.id, fieldId)
                          }
                          onOpenSource={setOpenSource}
                        />
                      ) : (
                        <CustomQaBlock
                          lang={lang}
                          item={currentSlide.item}
                          result={result}
                          suggestions={suggestionsForCustomQa(currentSlide.item, result)}
                          onChange={(patch) => onUpdateCustomQa(currentSlide.item.id, patch)}
                          onToggleCollect={(fieldId) =>
                            onUpdateCustomQa(currentSlide.item.id, {
                              collectFields: toggleCollectId(currentSlide.item.collectFields, fieldId),
                            })
                          }
                          onOpenSource={setOpenSource}
                        />
                      )}
                      </div>
                      {currentGroup && !filtering ? (
                        <button
                          type="button"
                          onClick={() =>
                            onAddCustomQa(
                              currentGroup.id,
                              currentSlide.kind === "custom" ? currentSlide.item.section : currentSlide.section,
                              currentSlide.kind === "custom" ? currentSlide.item.detailName : undefined,
                            )
                          }
                          className={pillPrimary}
                        >
                          <MaterialIcon name="add" className="text-[14px]" />
                          {t.addQuestion}
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-[14px] text-muted-foreground">{filtering ? t.filterEmpty : t.emptyCategory}</p>
                  )}
                </div>
              ) : (
                <div className="min-w-0 space-y-5 px-4 py-5 sm:px-7 sm:py-8">{sectionInner}</div>
              )}
          </article>

          {viewMode === "scroll" ? (
          <button
            type="button"
            onClick={onRescan}
            className="mt-10 inline-flex items-center gap-1 text-[13px] font-medium text-zinc-400 transition hover:text-foreground"
          >
            <MaterialIcon name="refresh" className="text-[16px]" />
            {t.rescan}
          </button>
          ) : null}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.04] bg-white/95 px-4 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-1.5">
          {viewMode === "slides" ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goSlide(-1)}
                disabled={safeIndex <= 0 || slideCount === 0}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[13px] font-semibold text-foreground disabled:opacity-40"
              >
                {t.prevItem}
              </button>
              <p className="shrink-0 text-[12px] font-medium text-zinc-500">
                {slideCount === 0 ? "0/0" : `${safeIndex + 1}/${slideCount}`}
              </p>
              <button
                type="button"
                onClick={() => goSlide(1)}
                disabled={safeIndex >= slideCount - 1 || slideCount === 0}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-assis-blue text-[13px] font-semibold text-white disabled:opacity-40"
              >
                {t.nextItem}
              </button>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <p
              className={`min-w-0 truncate text-[11px] font-medium ${
                cloudSave === "saving" ? "text-assis-blue" : "text-emerald-800"
              }`}
            >
              {cloudSave === "saving"
                ? t.liveSaving
                : savedAt
                  ? t.draftSavedAt.replace(
                      "{time}",
                      new Date(savedAt).toLocaleTimeString(he ? "he-IL" : "en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                    )
                  : t.liveSaved}
            </p>
          </div>
        </div>
      </div>

      {openSource ? (
        <SourceSheet
          lang={lang}
          claim={openSource.claim}
          source={openSource.source}
          question={openSource.question}
          onClose={() => setOpenSource(null)}
        />
      ) : null}
      {pendingTrue ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-zinc-900/25 p-4 backdrop-blur-[2px] sm:items-center"
          onClick={() => setPendingTrue(null)}
        >
          <div
            className="w-full max-w-md rounded-[1.5rem] border border-white/70 bg-white p-5 shadow-[0_24px_60px_-28px_rgba(16,24,40,0.35)] sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-assis-blue/80">
              {t.sureTitle}
            </p>
            <p className="mt-3 whitespace-pre-line text-[14px] leading-relaxed text-muted-foreground">
              {t.sureApproveBody.replace("{approved}", pendingTrue.currentText)}
            </p>
            <p className="mt-3 rounded-[1.1rem] bg-[#f7f8fa] px-4 py-3 text-[14px] leading-relaxed text-foreground" dir="auto">
              “{pendingTrue.nextText}”
            </p>
            <button
              type="button"
              onClick={() => {
                onPickQa(pendingTrue.topicId, pendingTrue.qaId, pendingTrue.claimId);
                setPendingTrue(null);
              }}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-assis-blue text-[13px] font-semibold text-white transition hover:bg-assis-blue-deep"
            >
              {t.sureApproveCta}
            </button>
            <button
              type="button"
              onClick={() => setPendingTrue(null)}
              className="mt-1.5 inline-flex h-10 w-full items-center justify-center rounded-full text-[13px] font-medium text-muted-foreground transition hover:text-foreground"
            >
              {t.sureKeepCta}
            </button>
          </div>
        </div>
      ) : null}
      {pendingScanGroup ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-zinc-900/25 p-4 backdrop-blur-[2px] sm:items-center"
          onClick={() => setPendingScanGroup(null)}
        >
          <div
            className="w-full max-w-md rounded-[1.5rem] border border-white/70 bg-white p-5 shadow-[0_24px_60px_-28px_rgba(16,24,40,0.35)] sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-assis-blue/80">
              {t.categoryScanConfirmTitle}
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              {t.categoryScanConfirmBody.replace(
                "{group}",
                he
                  ? categories.find((group) => group.id === pendingScanGroup)?.titleHe || ""
                  : categories.find((group) => group.id === pendingScanGroup)?.title || "",
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                const groupId = pendingScanGroup;
                setPendingScanGroup(null);
                onCategoryScan(groupId);
              }}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-assis-blue text-[13px] font-semibold text-white transition hover:bg-assis-blue-deep"
            >
              {t.categoryScanConfirmCta}
            </button>
            <button
              type="button"
              onClick={() => setPendingScanGroup(null)}
              className="mt-1.5 inline-flex h-10 w-full items-center justify-center rounded-full text-[13px] font-medium text-muted-foreground transition hover:text-foreground"
            >
              {t.categoryScanConfirmCancel}
            </button>
          </div>
        </div>
      ) : null}
      <ClarityGuide lang={lang} open={guide.open} onClose={guide.close} />
    </main>
  );
}

function VerdictBar({
  lang,
  verdict,
  editing,
  onTrue,
  onFalse,
  onNa,
  onEdit,
  onSave,
}: {
  lang: ClarityLang;
  verdict: "approved" | "rejected" | "pending" | "na";
  editing: boolean;
  onTrue: () => void;
  onFalse: () => void;
  onNa: () => void;
  onEdit: () => void;
  onSave: () => void;
}) {
  const t = COPY[lang];
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      <button type="button" onClick={onTrue} className={verdict === "approved" ? pillGood : pill}>
        {t.true}
      </button>
      <button type="button" onClick={onFalse} className={verdict === "rejected" ? pillWarn : pill}>
        {t.notTrue}
      </button>
      <button type="button" onClick={onNa} className={verdict === "na" ? pillMuted : pill}>
        {t.markNa}
      </button>
      {editing ? (
        <button type="button" onClick={onSave} className={pillPrimary}>
          {t.saveEdit}
        </button>
      ) : (
        <button type="button" onClick={onEdit} className={pill}>
          <MaterialIcon name="edit" className="text-[14px] text-zinc-500" />
          {t.editAnswer}
        </button>
      )}
    </div>
  );
}

function QuestionBlock({
  lang,
  block,
  onTrue,
  onFalse,
  onAnswer,
  onQuestion,
  onSaveEdit,
  onSkip,
  onUnskip,
  onOpenSource,
}: {
  lang: ClarityLang;
  block: QaBlock;
  onTrue: (claimId: string) => void;
  onFalse: (claimId: string) => void;
  onAnswer: (text: string) => void;
  onQuestion: (text: string) => void;
  onSaveEdit: (text: string, claimId?: string) => void;
  onSkip: () => void;
  onUnskip: () => void;
  onToggleCollect: (fieldId: string) => void;
  onOpenSource: (value: { claim: ExtractedClaim; source: ClaimSource }) => void;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const skipped = Boolean(block.skipped);
  const claims = block.claims.slice(0, 6);
  const textDir = he ? "rtl" : "ltr";
  const displayAnswer = block.answer.trim() || claims[0]?.text || "";
  const questionText = block.question.trim() || questionLabel(block.def, lang);
  const sourceClaim = claims.find((claim) => claim.text === displayAnswer) || claims[0];
  const approved = Object.values(block.decisions).some((decision) => decision === "approved");
  const needsFill = qaNeedsFill(block);
  const verdict: "approved" | "rejected" | "pending" | "na" = skipped
    ? "na"
    : approved
      ? "approved"
      : needsFill && !displayAnswer.trim()
        ? "pending"
        : Object.values(block.decisions).some((decision) => decision === "rejected") && !approved
          ? "rejected"
          : "pending";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(displayAnswer);
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [questionDraft, setQuestionDraft] = useState(questionText);
  const textSaveTimer = useRef(0);
  const questionSaveTimer = useRef(0);

  useEffect(() => {
    return () => {
      window.clearTimeout(textSaveTimer.current);
      window.clearTimeout(questionSaveTimer.current);
    };
  }, []);

  function pushQuestion(text: string, immediate = false) {
    setQuestionDraft(text);
    window.clearTimeout(questionSaveTimer.current);
    const apply = () => onQuestion(text);
    if (immediate) apply();
    else questionSaveTimer.current = window.setTimeout(apply, 280);
  }

  function saveQuestion() {
    window.clearTimeout(questionSaveTimer.current);
    onQuestion(questionDraft);
    setEditingQuestion(false);
  }

  function pushAnswer(text: string, immediate = false) {
    setDraft(text);
    window.clearTimeout(textSaveTimer.current);
    const apply = () => {
      if (text !== displayAnswer) onAnswer(text);
    };
    if (immediate) apply();
    else textSaveTimer.current = window.setTimeout(apply, 280);
  }

  function saveEdit() {
    window.clearTimeout(textSaveTimer.current);
    const text = draft;
    const claim = claims.find((item) => item.text === text);
    onSaveEdit(text, claim?.id);
    onUnskip();
    setEditing(false);
  }

  return (
    <article className="min-w-0 max-w-full">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[11px] font-medium text-zinc-400">{t.questionLabel}</p>
        {skipped ? (
          <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 ring-1 ring-zinc-200">
            {t.statusNa}
          </span>
        ) : needsFill && verdict === "rejected" ? (
          <span className="inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-900 ring-1 ring-orange-200">
            {t.fixAnswer}
          </span>
        ) : needsFill ? (
          <span className="inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-900 ring-1 ring-orange-200">
            {t.mustFill}
          </span>
        ) : verdict === "pending" ? (
          <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900 ring-1 ring-amber-200">
            {t.needsConfirm}
          </span>
        ) : null}
        {editingQuestion ? (
          <button type="button" onClick={saveQuestion} className={pillPrimary}>
            {t.saveQuestion}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setQuestionDraft(questionText);
              setEditingQuestion(true);
            }}
            className={pill}
          >
            <MaterialIcon name="edit" className="text-[14px] text-zinc-500" />
            {t.editQuestion}
          </button>
        )}
      </div>
      {editingQuestion ? (
        <textarea
          value={questionDraft}
          onChange={(e) => pushQuestion(e.target.value)}
          onBlur={() => {
            window.clearTimeout(questionSaveTimer.current);
            if (questionDraft !== questionText) onQuestion(questionDraft);
          }}
          rows={3}
          autoFocus
          placeholder={t.questionPlaceholder}
          className={questionBox}
          dir={textDir}
        />
      ) : (
        <h3 className="mt-1 min-w-0 max-w-full break-words text-start text-[15px] font-medium text-foreground [overflow-wrap:anywhere]" dir={textDir}>
          {questionText}
        </h3>
      )}
      {verdict === "rejected" && !skipped ? (
        <p className="mt-1 text-[12px] leading-relaxed text-orange-800">{t.fixAnswerHint}</p>
      ) : needsFill ? (
        <p className="mt-1 text-[12px] leading-relaxed text-orange-800">{t.mustFillHint}</p>
      ) : null}
      <p className="mt-3 text-[11px] font-medium text-zinc-400">{t.answerLabel}</p>
      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => pushAnswer(e.target.value)}
          onBlur={() => {
            window.clearTimeout(textSaveTimer.current);
            if (draft !== displayAnswer) onAnswer(draft);
          }}
          rows={8}
          autoFocus
          placeholder={t.answerPlaceholder}
          className={answerBox}
          dir={textDir}
        />
      ) : (
        <p className={answerText} dir={textDir}>
          {shortDashes(displayAnswer) || "-"}
        </p>
      )}
      {sourceClaim?.sources[0] ? (
        <SourceLinks lang={lang} claim={sourceClaim} source={sourceClaim.sources[0]} onOpenSource={onOpenSource} />
      ) : null}
      <VerdictBar
        lang={lang}
        verdict={verdict}
        editing={editing}
        onTrue={() => {
          window.clearTimeout(textSaveTimer.current);
          const text = editing ? draft : displayAnswer;
          if (!text.trim()) {
            setDraft(text);
            setEditing(true);
            return;
          }
          if (editing && text !== displayAnswer) onAnswer(text);
          const claim = claims.find((item) => item.text === text) || claims[0];
          if (claim) onTrue(claim.id);
          else onSaveEdit(text);
          onUnskip();
          setEditing(false);
        }}
        onFalse={() => {
          window.clearTimeout(textSaveTimer.current);
          if (editing && draft !== displayAnswer) onAnswer(draft);
          if (sourceClaim) onFalse(sourceClaim.id);
          onUnskip();
          setEditing(true);
        }}
        onNa={() => {
          window.clearTimeout(textSaveTimer.current);
          setEditing(false);
          onSkip();
        }}
        onEdit={() => {
          setDraft(displayAnswer);
          setEditing(true);
        }}
        onSave={saveEdit}
      />
    </article>
  );
}

function CustomQaBlock({
  lang,
  item,
  result,
  suggestions,
  onChange,
  onOpenSource,
}: {
  lang: ClarityLang;
  item: CustomQaItem;
  result: ScanResult;
  suggestions: ExtractedClaim[];
  onChange: (patch: Partial<CustomQaItem>) => void;
  onToggleCollect: (fieldId: string) => void;
  onOpenSource: (value: { claim: ExtractedClaim; source: ClaimSource; question?: string }) => void;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const textDir = he ? "rtl" : "ltr";
  const questionText = item.question.trim() || item.detailName?.trim() || "";
  const confirmed = Boolean(item.verdict === "approved" || item.skipped || item.notApplicable);
  const needsFill = customNeedsFill(item);
  const verdict: "approved" | "rejected" | "pending" | "na" =
    item.skipped || item.notApplicable
      ? "na"
      : item.verdict === "approved"
        ? "approved"
        : item.verdict === "rejected"
          ? "rejected"
          : "pending";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.answer);
  const [editingQuestion, setEditingQuestion] = useState(!item.question.trim());
  const [questionDraft, setQuestionDraft] = useState(item.question || questionText);
  const textSaveTimer = useRef(0);
  const questionSaveTimer = useRef(0);
  const located = sourceForCustomQa(item, suggestions, result);

  useEffect(() => {
    return () => {
      window.clearTimeout(textSaveTimer.current);
      window.clearTimeout(questionSaveTimer.current);
    };
  }, []);

  function pushQuestion(text: string, immediate = false) {
    setQuestionDraft(text);
    window.clearTimeout(questionSaveTimer.current);
    const apply = () => onChange({ question: text });
    if (immediate) apply();
    else questionSaveTimer.current = window.setTimeout(apply, 280);
  }

  function saveQuestion() {
    window.clearTimeout(questionSaveTimer.current);
    onChange({ question: questionDraft });
    setEditingQuestion(false);
  }

  function pushAnswer(text: string, patch: Partial<CustomQaItem> = {}, immediate = false) {
    setDraft(text);
    window.clearTimeout(textSaveTimer.current);
    const apply = () => {
      onChange({
        answer: text,
        skipped: false,
        notApplicable: false,
        verdict: text.trim() ? item.verdict || "pending" : "pending",
        ...patch,
      });
    };
    if (immediate) apply();
    else textSaveTimer.current = window.setTimeout(apply, 280);
  }

  function saveEdit() {
    window.clearTimeout(textSaveTimer.current);
    onChange({
      answer: draft,
      skipped: false,
      notApplicable: false,
      verdict: draft.trim() ? "approved" : "pending",
    });
    setEditing(false);
  }

  return (
    <article className="min-w-0 max-w-full">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[11px] font-medium text-zinc-400">{t.questionLabel}</p>
        {item.skipped || item.notApplicable ? (
          <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 ring-1 ring-zinc-200">
            {t.statusNa}
          </span>
        ) : item.verdict === "rejected" ? (
          <span className="inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-900 ring-1 ring-orange-200">
            {t.fixAnswer}
          </span>
        ) : needsFill ? (
          <span className="inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-900 ring-1 ring-orange-200">
            {t.mustFill}
          </span>
        ) : !confirmed ? (
          <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-900 ring-1 ring-amber-200">
            {t.needsConfirm}
          </span>
        ) : null}
        {editingQuestion ? (
          <button type="button" onClick={saveQuestion} className={pillPrimary}>
            {t.saveQuestion}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setQuestionDraft(item.question || questionText);
              setEditingQuestion(true);
            }}
            className={pill}
          >
            <MaterialIcon name="edit" className="text-[14px] text-zinc-500" />
            {t.editQuestion}
          </button>
        )}
      </div>
      {editingQuestion ? (
        <textarea
          value={questionDraft}
          onChange={(e) => pushQuestion(e.target.value)}
          onBlur={() => {
            window.clearTimeout(questionSaveTimer.current);
            if (questionDraft !== item.question) onChange({ question: questionDraft });
          }}
          rows={3}
          autoFocus
          placeholder={t.questionPlaceholder}
          className={questionBox}
          dir={textDir}
        />
      ) : (
        <h3 className="mt-1 min-w-0 max-w-full break-words text-start text-[15px] font-medium text-foreground [overflow-wrap:anywhere]" dir={textDir}>
          {questionText || t.questionPlaceholder}
        </h3>
      )}
      {item.verdict === "rejected" && !item.skipped && !item.notApplicable ? (
        <p className="mt-1 text-[12px] leading-relaxed text-orange-800">{t.fixAnswerHint}</p>
      ) : needsFill ? (
        <p className="mt-1 text-[12px] leading-relaxed text-orange-800">{t.mustFillHint}</p>
      ) : null}
      <p className="mt-3 text-[11px] font-medium text-zinc-400">{t.answerLabel}</p>
      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => pushAnswer(e.target.value)}
          onBlur={() => {
            window.clearTimeout(textSaveTimer.current);
            if (draft !== item.answer) {
              onChange({
                answer: draft,
                skipped: false,
                notApplicable: false,
                verdict: draft.trim() ? item.verdict || "pending" : "pending",
              });
            }
          }}
          rows={8}
          autoFocus
          placeholder={t.answerPlaceholder}
          className={answerBox}
          dir={textDir}
        />
      ) : (
        <p className={answerText} dir={textDir}>
          {shortDashes(item.answer) || "-"}
        </p>
      )}
      {located && (item.answer.trim() || item.suggestedAnswer?.trim() || item.sourceUrl) ? (
        <SourceLinks
          lang={lang}
          claim={located.claim}
          source={located.source}
          question={item.question}
          onOpenSource={onOpenSource}
        />
      ) : null}
      <VerdictBar
        lang={lang}
        verdict={verdict}
        editing={editing}
        onTrue={() => {
          window.clearTimeout(textSaveTimer.current);
          const text = editing ? draft : item.answer;
          if (!text.trim()) {
            setDraft(text);
            setEditing(true);
            return;
          }
          onChange({
            answer: text,
            skipped: false,
            notApplicable: false,
            verdict: "approved",
          });
          setEditing(false);
        }}
        onFalse={() => {
          window.clearTimeout(textSaveTimer.current);
          onChange({
            answer: editing ? draft : item.answer,
            skipped: false,
            notApplicable: false,
            verdict: "rejected",
          });
          setEditing(true);
        }}
        onNa={() => {
          window.clearTimeout(textSaveTimer.current);
          setEditing(false);
          onChange({ skipped: true, notApplicable: true, verdict: "rejected" });
        }}
        onEdit={() => {
          setDraft(item.answer);
          setEditing(true);
        }}
        onSave={saveEdit}
      />
    </article>
  );
}

function scrollIframeToHit(iframe: HTMLIFrameElement | null) {
  try {
    const win = iframe?.contentWindow as (Window & { __clarityScrollToHit?: () => boolean }) | null;
    if (win?.__clarityScrollToHit) return Boolean(win.__clarityScrollToHit());
    const el = iframe?.contentDocument?.querySelector("mark[data-clarity], .clarity-hit") as HTMLElement | null;
    el?.scrollIntoView({ block: "center", inline: "nearest" });
    return Boolean(el);
  } catch {
    return false;
  }
}

function SourceSheet({
  lang,
  claim,
  source,
  question,
  onClose,
}: {
  lang: ClarityLang;
  claim: ExtractedClaim;
  source: ClaimSource;
  question?: string;
  onClose: () => void;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const label = friendlyPageLabel(source, he ? "עמוד הבית" : "Home");
  const excerpt = source.excerpt || claim.text;
  const parts = excerpt.split(claim.text);
  const exactUrl = textFragmentUrl(source.url, claim.text);
  const previewUrl = `/api/clarity/preview?url=${encodeURIComponent(source.url)}&quote=${encodeURIComponent(claim.text)}&excerpt=${encodeURIComponent(excerpt.slice(0, 400))}&question=${encodeURIComponent((question || "").slice(0, 240))}`;
  let path = source.path;
  try {
    path = decodeURIComponent(source.path);
  } catch {
    /* keep */
  }

  function jumpToPlace() {
    scrollIframeToHit(iframeRef.current);
    window.setTimeout(() => scrollIframeToHit(iframeRef.current), 250);
    window.setTimeout(() => scrollIframeToHit(iframeRef.current), 800);
  }

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "clarity-found") jumpToPlace();
    };
    window.addEventListener("message", onMessage);
    const timers = [400, 900, 1600, 2400].map((ms) => window.setTimeout(jumpToPlace, ms));
    return () => {
      window.removeEventListener("message", onMessage);
      timers.forEach((id) => window.clearTimeout(id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewUrl]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-900/25 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.4rem] border border-white/70 bg-white/95 shadow-[0_24px_60px_-28px_rgba(16,24,40,0.35)] sm:max-h-[92vh] sm:rounded-[1.6rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-assis-blue/80">
            {t.sourceSheetTitle}
          </p>
          <h3 className="font-display mt-2 text-lg font-semibold tracking-[-0.03em] text-foreground">
            {label}
          </h3>
          <p className="mt-1 text-[12px] text-zinc-400" dir="ltr">
            {path}
          </p>
          <blockquote className="mt-3 max-h-24 overflow-auto rounded-[1.1rem] bg-[#f7f8fa] p-3 text-start text-[14px] leading-relaxed text-foreground" dir={he ? "rtl" : "ltr"}>
            {parts.length === 1 ? (
              excerpt
            ) : (
              <>
                {parts[0]}
                <mark className="rounded bg-assis-blue-light px-0.5 text-foreground">{claim.text}</mark>
                {parts.slice(1).join(claim.text)}
              </>
            )}
          </blockquote>
          <button
            type="button"
            onClick={jumpToPlace}
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-assis-blue text-[13px] font-semibold text-white shadow-sm transition hover:bg-assis-blue-deep"
          >
            <MaterialIcon name="my_location" className="text-[18px]" />
            {t.jumpToHighlight}
          </button>
        </div>
        <div className="relative mx-4 mt-3 min-h-[180px] flex-1 overflow-hidden rounded-[1.1rem] border border-black/[0.06] bg-[#f7f8fa] sm:mx-6 sm:min-h-[280px]">
          <iframe
            ref={iframeRef}
            title={label}
            src={previewUrl}
            className="h-[36dvh] w-full min-h-[180px] bg-white sm:h-[52vh] sm:min-h-[320px]"
            sandbox="allow-same-origin allow-scripts"
            onLoad={() => {
              window.setTimeout(jumpToPlace, 150);
              window.setTimeout(jumpToPlace, 600);
              window.setTimeout(jumpToPlace, 1400);
            }}
          />
        </div>
        <div className="px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-4">
          <a
            href={exactUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full border border-black/[0.08] bg-white text-[13px] font-semibold text-foreground shadow-sm transition hover:bg-zinc-50"
          >
            {t.openExactPlace}
            <MaterialIcon name="open_in_new" className="text-[16px]" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-full border border-black/[0.08] bg-white text-[13px] font-semibold text-foreground shadow-sm transition hover:bg-zinc-50"
          >
            {t.closeSource}
          </button>
        </div>
      </div>
    </div>
  );
}
