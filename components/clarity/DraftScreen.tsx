"use client";

import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CHIP_SETS,
  chipHint,
  chipLabel,
  qaChipSet,
  type ChipSetId,
} from "@/lib/clarity/chips";
import { toggleCollectId } from "@/lib/clarity/collect-fields";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import { isProcessTopic } from "@/lib/clarity/focus";
import { qaBlockDone, qaBlocks, qaPlaceholder, questionLabel, type QaBlock } from "@/lib/clarity/qa";
import { isScanRelevantQa, suggestionsForCustomQa } from "@/lib/clarity/suggest";
import { friendlyPageLabel, textFragmentUrl } from "@/lib/clarity/source";
import { GROUPS } from "@/lib/clarity/topics";
import { writeGuideForCustomQa, writeGuideForTopic, type WriteGuide } from "@/lib/clarity/write-guide";
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
import { KnowledgeExportMenu } from "./KnowledgeExport";
import MaterialIcon from "./MaterialIcon";

const pill =
  "inline-flex min-h-11 items-center gap-1 rounded-full border border-black/[0.08] bg-white px-3 text-[13px] font-medium text-zinc-600 transition hover:border-black/[0.14] hover:text-foreground sm:min-h-7 sm:px-2.5 sm:text-[11px]";
const pillPrimary =
  "inline-flex min-h-11 items-center gap-1 rounded-full bg-assis-blue px-3 text-[13px] font-medium text-white transition hover:bg-assis-blue-deep sm:min-h-7 sm:px-2.5 sm:text-[11px]";
const pillDark =
  "inline-flex min-h-11 items-center gap-1 rounded-full bg-assis-blue-light px-3 text-[13px] font-medium text-assis-blue-deep transition hover:bg-[#dceafe] sm:min-h-7 sm:px-2.5 sm:text-[11px]";
const pillGood =
  "inline-flex min-h-11 items-center gap-1 rounded-full bg-emerald-50 px-3 text-[13px] font-medium text-emerald-800 ring-1 ring-emerald-200/80 transition hover:bg-emerald-100 sm:min-h-7 sm:px-2.5 sm:text-[11px]";
const pillMuted =
  "inline-flex min-h-11 items-center gap-1 rounded-full bg-zinc-200 px-3 text-[13px] font-medium text-zinc-500 transition hover:bg-zinc-300 sm:min-h-7 sm:px-2.5 sm:text-[11px]";

function SourceLinks({
  lang,
  claim,
  source,
  onOpenSource,
}: {
  lang: ClarityLang;
  claim: ExtractedClaim;
  source: ClaimSource;
  onOpenSource: (value: { claim: ExtractedClaim; source: ClaimSource }) => void;
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
      <button type="button" onClick={() => onOpenSource({ claim, source })} className={pill}>
        <MaterialIcon name="my_location" className="text-[14px] text-zinc-500" />
        {t.seeExactPlace}
      </button>
    </div>
  );
}

function customDone(item: CustomQaItem) {
  return Boolean(item.skipped || item.answer.trim());
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

function WriteHint({ lang, guide }: { lang: ClarityLang; guide: WriteGuide | null }) {
  const t = COPY[lang];
  if (!guide || (!guide.why && guide.bullets.length === 0 && !guide.example)) return null;
  return (
    <div className="rounded-[1.1rem] border border-assis-blue/15 bg-assis-blue-light/60 px-3.5 py-3">
      <p className="text-[12px] font-semibold text-assis-blue-deep">{t.writeHere}</p>
      {guide.why ? <p className="mt-1 text-[13px] leading-relaxed text-assis-blue-deep/90">{guide.why}</p> : null}
      {guide.bullets.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pe-4 ps-5 text-[13px] leading-relaxed text-assis-blue-deep/90">
          {guide.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {guide.example ? (
        <p className="mt-2 text-[12px] leading-relaxed text-zinc-600">
          <span className="font-semibold text-zinc-500">{t.writeExample}: </span>
          {guide.example}
        </p>
      ) : null}
    </div>
  );
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

export default function DraftScreen({
  lang,
  result,
  state,
  savedAt,
  cloudSave = "idle",
  onPickQa,
  onRejectQa,
  onQaAnswer,
  onSaveEdit,
  onSkipQa,
  onUnskipQa,
  onAddCustomQa,
  onUpdateCustomQa,
  onToggleQaCollect,
  signedIn,
  onSaveDraft,
  onDownloadDraft,
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
  onSaveEdit: (topicId: TopicId, qaId: string, text: string, claimId?: string) => void;
  onSkipQa: (topicId: TopicId, qaId: string) => void;
  onUnskipQa: (topicId: TopicId, qaId: string) => void;
  onAddCustomQa: (groupId: TopicGroupId, section: CustomQaItem["section"], detailName?: string) => void;
  onUpdateCustomQa: (id: string, patch: Partial<CustomQaItem>) => void;
  onToggleQaCollect: (topicId: TopicId, qaId: string, fieldId: string) => void;
  onSaveDraft: () => void;
  onDownloadDraft: () => void;
  onBack?: () => void;
  onRescan: () => void;
  onCategoryScan: (groupId: TopicGroupId) => void;
  categoryScanId?: TopicGroupId | null;
  categoryScanNote?: string;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const guide = useClarityGuide();
  const [savedFlash, setSavedFlash] = useState(false);
  const [openSource, setOpenSource] = useState<{ claim: ExtractedClaim; source: ClaimSource } | null>(
    null,
  );
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


  const categories = useMemo(() => {
    return GROUPS.map((group) => {
      const topics = result.topics.filter((topic) => topic.group === group.id);
      const allBlocks = topics.flatMap((topic) =>
        qaBlocks(topic, state)
          .filter((block) => !block.skipped)
          .map((block) => ({ topic, block })),
      );
      const infoBlocks = allBlocks.filter(({ topic }) => !isProcessTopic(topic.id));
      const processBlocks = allBlocks.filter(({ topic }) => isProcessTopic(topic.id));
      const customInfo = (state.customQas || []).filter((item) => item.groupId === group.id && item.section !== "process");
      const customProcess = (state.customQas || []).filter(
        (item) => item.groupId === group.id && item.section === "process",
      );
      const customAll = (state.customQas || []).filter((item) => item.groupId === group.id);
      const relevantInfo = customInfo.filter((item) => isScanRelevantQa(item, result));
      const includeProcess =
        Boolean(result.importedKb || result.demo) ||
        relevantInfo.length > 0 ||
        group.id === "delivery" ||
        group.id === "returns" ||
        group.id === "warranty";
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
  }, [result, state]);

  const [activeGroup, setActiveGroup] = useState<TopicGroupId>(
    () => categories.find((group) => group.visible > 0)?.id || "general",
  );
  const active = categories.find((group) => group.id === activeGroup) || categories[0];
  const allSlides = useMemo(() => {
    const items: SlideItem[] = [];
    for (const group of categories) {
      for (const item of [...group.relevantInfo, ...(group.includeProcess ? group.customProcess : [])]) {
        items.push({
          kind: "custom",
          key: `custom:${item.id}`,
          groupId: group.id,
          item,
          section: item.section,
        });
      }
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
  }, [categories]);
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
    active?.id !== "open" &&
    ((processItems.length || 0) > 0 || (active?.processBlocks.length || 0) > 0);
  const useProcess = sectionTab === "process" && showProcessTab;
  const hasVisible = useProcess
    ? processItems.length > 0 || (active?.processBlocks.length || 0) > 0
    : infoItems.length > 0;

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
      id !== "open" && ((group?.customProcess.length || 0) > 0 || (group?.processBlocks.length || 0) > 0);
    const nextTab = !hasInfo && hasProcess ? "process" : "info";
    setSectionTab(nextTab);
    if (viewMode === "slides") {
      const next = allSlides.findIndex(
        (item) => item.groupId === id && (nextTab === "process" ? item.section === "process" : item.section !== "process"),
      );
      const fallback = allSlides.findIndex((item) => item.groupId === id);
      const idx = next >= 0 ? next : fallback;
      if (idx >= 0) setQIndex(idx);
    }
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
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                  {he ? active?.titleHe : active?.title}
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
                  {active?.id === "open" ? t.openBody : useProcess ? t.processesBody : t.draftBody}
                </p>
                {showProcessTab ? (
                  <div className="mt-4 inline-flex w-full rounded-full bg-[#f4f5f7] p-0.5 sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setSectionTab("info");
                        if (viewMode === "slides" && active) {
                          const idx = allSlides.findIndex((item) => item.groupId === active.id && item.section !== "process");
                          if (idx >= 0) setQIndex(idx);
                        }
                      }}
                      className={`flex-1 rounded-full px-3.5 py-2.5 text-[13px] font-medium transition sm:flex-none sm:py-1.5 sm:text-[12px] ${
                        !useProcess ? "bg-white text-foreground shadow-sm" : "text-zinc-500 hover:text-foreground"
                      }`}
                    >
                      {t.infoTab}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSectionTab("process");
                        if (viewMode === "slides" && active) {
                          const idx = allSlides.findIndex((item) => item.groupId === active.id && item.section === "process");
                          if (idx >= 0) setQIndex(idx);
                        }
                      }}
                      className={`flex-1 rounded-full px-3.5 py-2.5 text-[13px] font-medium transition sm:flex-none sm:py-1.5 sm:text-[12px] ${
                        useProcess ? "bg-white text-foreground shadow-sm" : "text-zinc-500 hover:text-foreground"
                      }`}
                    >
                      {t.processTab}
                    </button>
                  </div>
                ) : null}
              </div>

              {!useProcess && detailGroups(infoItems, t.addedQuestions).map(({ detailName, items }) => (
                <section
                  key={detailName}
                  className="overflow-hidden rounded-[1.35rem] border border-black/[0.06] bg-white"
                >
                  <header className="flex items-center justify-between gap-3 border-b border-black/[0.05] px-4 py-3 sm:px-5">
                    <h3 className="min-w-0 text-[15px] font-semibold tracking-[-0.02em] text-foreground">
                      {detailName}
                    </h3>
                    <button
                      type="button"
                      onClick={() => onAddCustomQa(active!.id, "info", detailName)}
                      className={pill}
                    >
                      <MaterialIcon name="add" className="text-[14px]" />
                      {t.addQuestion}
                    </button>
                  </header>
                  <div className="space-y-4 px-4 py-4 sm:px-5">
                    <WriteHint
                      lang={lang}
                      guide={
                        items.some((item) => !customDone(item)) ? writeGuideForCustomQa(items[0], lang) : null
                      }
                    />
                    {items.map((item) => (
                      <div key={item.id} className="border-t border-black/[0.05] pt-4 first:border-t-0 first:pt-0">
                        <CustomQaBlock
                          lang={lang}
                          item={item}
                          guide={writeGuideForCustomQa(item, lang)}
                          suggestions={suggestionsForCustomQa(item, result)}
                          onChange={(patch) => onUpdateCustomQa(item.id, patch)}
                          onToggleSkip={() => onUpdateCustomQa(item.id, { skipped: !item.skipped })}
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

              {useProcess && active ? (
                <section className="overflow-hidden rounded-[1.35rem] border border-assis-blue/20 bg-[#f6f9ff]">
                  <header className="flex items-center justify-between gap-3 border-b border-assis-blue/15 px-4 py-3 sm:px-5">
                    <div>
                      <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">
                        {t.processesSection}
                      </h3>
                      <p className="mt-1 text-[12px] leading-relaxed text-zinc-500">{t.processesBody}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddCustomQa(active.id, "process", t.processesSection)}
                      className={pill}
                    >
                      <MaterialIcon name="add" className="text-[14px]" />
                      {t.addQuestion}
                    </button>
                  </header>
                  <div className="space-y-4 px-4 py-4 sm:px-5">
                    {processItems.map((item) => (
                        <div key={item.id} className="rounded-[1.2rem] border border-black/[0.06] bg-white px-4 py-4">
                          <CustomQaBlock
                            lang={lang}
                            item={item}
                            guide={writeGuideForCustomQa(item, lang)}
                            suggestions={suggestionsForCustomQa(item, result)}
                            onChange={(patch) => onUpdateCustomQa(item.id, patch)}
                            onToggleSkip={() => onUpdateCustomQa(item.id, { skipped: !item.skipped })}
                            onToggleCollect={(fieldId) =>
                              onUpdateCustomQa(item.id, {
                                collectFields: toggleCollectId(item.collectFields, fieldId),
                              })
                            }
                            onOpenSource={setOpenSource}
                          />
                        </div>
                      ))}
                    {groupProcessBlocks(active.processBlocks || []).map(({ topic, blocks }) => (
                      <div key={topic.id} className="rounded-[1.2rem] border border-black/[0.06] bg-white px-4 py-4">
                        <h4 className="text-[14px] font-semibold text-foreground">
                          {he ? topic.titleHe : topic.title}
                        </h4>
                        <div className="mt-3">
                          <WriteHint lang={lang} guide={writeGuideForTopic(topic.id, lang)} />
                        </div>
                        <div className="mt-3 space-y-4">
                          {blocks.map(({ block }) => (
                            <QuestionBlock
                              key={`${topic.id}-${block.def.id}`}
                              lang={lang}
                              block={block}
                              onTrue={(claimId) => tryPickQa(topic.id, block.def.id, claimId, block)}
                              onFalse={(claimId) => onRejectQa(topic.id, block.def.id, claimId)}
                              onAnswer={(text) => onQaAnswer(topic.id, block.def.id, text)}
                              onSaveEdit={(text, claimId) => onSaveEdit(topic.id, block.def.id, text, claimId)}
                              onSkip={() => onSkipQa(topic.id, block.def.id)}
                              onUnskip={() => onUnskipQa(topic.id, block.def.id)}
                              onToggleCollect={(fieldId) => onToggleQaCollect(topic.id, block.def.id, fieldId)}
                              onOpenSource={setOpenSource}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              {!hasVisible ? (
                <p className="text-[14px] text-muted-foreground">{t.emptyCategory}</p>
              ) : null}

              {active ? (
                <button
                  type="button"
                  onClick={() =>
                    onAddCustomQa(active.id, useProcess ? "process" : "info", useProcess ? t.processesSection : undefined)
                  }
                  className={pill}
                >
                  <MaterialIcon name="add" className="text-[14px]" />
                  {t.addQuestion}
                </button>
              ) : null}
            </>
  );

  return (
    <main className="mx-auto max-w-6xl overscroll-y-contain px-4 pb-[max(7.5rem,calc(env(safe-area-inset-bottom)+6rem))] pt-2 sm:px-8 sm:pb-28 sm:pt-8">
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

      <div className="sticky top-0 z-30 -mx-4 border-b border-black/[0.05] bg-[#f7f8fa]/95 px-4 py-2 backdrop-blur-md sm:mx-0 sm:rounded-[1.3rem] sm:border sm:px-3 sm:py-2.5">
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
          <ClarityHelpButton label={t.guideCta} onClick={guide.show} />
          <KnowledgeExportMenu lang={lang} result={result} state={state} onDownloadDraft={onDownloadDraft} />
        </div>
      </div>

      {categoryScanNote ? (
        <p className="mt-3 rounded-[1.1rem] bg-assis-blue-light px-4 py-2.5 text-[13px] leading-relaxed text-assis-blue-deep">
          {categoryScanNote}
        </p>
      ) : null}
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
          {categories
            .filter((group) => group.visible > 0 || group.id === "open")
            .map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => goToGroup(group.id)}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition sm:px-3.5 sm:py-2 sm:text-[13px] ${
                (viewMode === "slides" ? currentGroup?.id : active?.id) === group.id
                  ? "bg-assis-blue text-white"
                  : group.done > 0 && group.done >= group.visible && group.visible > 0
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-white/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              {group.done > 0 && group.done >= group.visible && group.visible > 0 ? "✓ " : ""}
              {he ? group.titleHe : group.title}
              {group.visible ? ` · ${group.done}/${group.visible}` : ""}
            </button>
          ))}
        </div>
        {(viewMode === "slides" ? currentGroup : active) ? (
          <button
            type="button"
            onClick={() => onCategoryScan((viewMode === "slides" ? currentGroup : active)!.id)}
            disabled={Boolean(categoryScanId)}
            className="mt-2 inline-flex h-8 items-center rounded-full border border-black/[0.06] bg-white px-3 text-[11px] font-semibold text-foreground disabled:opacity-50"
          >
            {categoryScanId
              ? t.categoryScanning
              : t.categoryScan}
          </button>
        ) : null}
      </div>

      <div className="mt-6 lg:flex lg:items-start lg:gap-8">
        <nav className={`hidden w-56 shrink-0 ${viewMode === "scroll" ? "lg:block" : ""}`}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            {t.categoriesNav}
          </p>
          <div className="sticky top-28 mt-3 space-y-1">
            {categories
              .filter((group) => group.visible > 0 || group.id === "open")
              .map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => goToGroup(group.id)}
                className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-start text-[13px] font-medium transition ${
                  active?.id === group.id
                    ? "bg-assis-blue-light text-assis-blue-deep shadow-sm"
                    : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                }`}
              >
                <span>{he ? group.titleHe : group.title}</span>
                <span className={`text-[11px] ${active?.id === group.id ? "text-assis-blue-deep/70" : "text-zinc-400"}`}>
                  {group.visible ? `${group.done}/${group.visible}` : ""}
                </span>
              </button>
            ))}
          </div>
        </nav>

        <div className="min-w-0 flex-1">
          <article
            onTouchStart={onSlideTouchStart}
            onTouchEnd={onSlideTouchEnd}
            className="touch-pan-y overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03),0_16px_40px_-24px_rgba(16,24,40,0.18)]"
          >
              <div className="hidden overflow-x-auto border-b border-black/[0.04] px-4 py-3 text-[12px] text-zinc-400 sm:block sm:px-5" dir="ltr">
                {result.storeUrl.replace(/\/$/, "")}
              </div>
              {viewMode === "slides" ? (
                <div key={currentSlide?.key || "empty"} className="clarity-slide space-y-4 px-4 py-5 sm:px-7 sm:py-8">
                  {currentSlide ? (
                    <>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-assis-blue/80">
                          {he ? currentGroup?.titleHe : currentGroup?.title}
                        </p>
                        <h2 className="font-display mt-1 text-[1.25rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[1.45rem]">
                          {currentSlide.kind === "qa"
                            ? he
                              ? currentSlide.topic.titleHe
                              : currentSlide.topic.title
                            : currentSlide.item.detailName || t.addedQuestions}
                        </h2>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-500">
                          {currentGroup?.id === "open"
                            ? t.openBody
                            : currentSlide.kind === "qa"
                              ? t.processesBody
                              : t.draftBody}
                        </p>
                      </div>
                      {currentSlide.kind === "qa" ? (
                        <QuestionBlock
                          lang={lang}
                          block={currentSlide.block}
                          guide={writeGuideForTopic(currentSlide.topic.id, lang)}
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
                          guide={writeGuideForCustomQa(currentSlide.item, lang)}
                          suggestions={suggestionsForCustomQa(currentSlide.item, result)}
                          onChange={(patch) => onUpdateCustomQa(currentSlide.item.id, patch)}
                          onToggleSkip={() =>
                            onUpdateCustomQa(currentSlide.item.id, { skipped: !currentSlide.item.skipped })
                          }
                          onToggleCollect={(fieldId) =>
                            onUpdateCustomQa(currentSlide.item.id, {
                              collectFields: toggleCollectId(currentSlide.item.collectFields, fieldId),
                            })
                          }
                          onOpenSource={setOpenSource}
                        />
                      )}
                      {currentGroup ? (
                        <button
                          type="button"
                          onClick={() =>
                            onAddCustomQa(
                              currentGroup.id,
                              currentSlide.kind === "custom" ? currentSlide.item.section : currentSlide.section,
                              currentSlide.kind === "custom" ? currentSlide.item.detailName : undefined,
                            )
                          }
                          className={pill}
                        >
                          <MaterialIcon name="add" className="text-[14px]" />
                          {t.addQuestion}
                        </button>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-[14px] text-muted-foreground">{t.emptyCategory}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-5 px-4 py-5 sm:px-7 sm:py-8">{sectionInner}</div>
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
          {viewMode === "slides" && slideCount > 0 ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goSlide(-1)}
                disabled={safeIndex <= 0}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[13px] font-semibold text-foreground disabled:opacity-40"
              >
                {t.prevItem}
              </button>
              <p className="shrink-0 text-[12px] font-medium text-zinc-500">
                {safeIndex + 1}/{slideCount}
              </p>
              <button
                type="button"
                onClick={() => goSlide(1)}
                disabled={safeIndex >= slideCount - 1}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-assis-blue text-[13px] font-semibold text-white disabled:opacity-40"
              >
                {t.nextItem}
              </button>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <p
              className={`min-w-0 truncate text-[11px] font-medium ${
                cloudSave === "error"
                  ? "text-amber-800"
                  : cloudSave === "saved"
                    ? "text-emerald-800"
                    : "text-zinc-500"
              }`}
            >
              {cloudSave === "saving"
                ? t.savingCloud
                : cloudSave === "saved"
                  ? t.draftSavedAt.replace(
                      "{time}",
                      savedAt
                        ? new Date(savedAt).toLocaleTimeString(he ? "he-IL" : "en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "",
                    )
                  : cloudSave === "error"
                    ? t.draftSaveCloudError
                      : signedIn
                        ? t.draftSavedCloudHint
                        : t.draftSavedHint}
            </p>
            <button
              type="button"
              onClick={() => {
                onSaveDraft();
                if (!signedIn) {
                  setSavedFlash(true);
                  window.setTimeout(() => setSavedFlash(false), 1600);
                }
              }}
              className="shrink-0 text-[12px] font-medium text-zinc-500 underline-offset-2 transition hover:text-foreground hover:underline"
            >
              {savedFlash || cloudSave === "saved" ? t.draftSaved : t.saveDraft}
            </button>
          </div>
        </div>
      </div>

      {openSource ? (
        <SourceSheet
          lang={lang}
          claim={openSource.claim}
          source={openSource.source}
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
  onEdit,
  onSave,
}: {
  lang: ClarityLang;
  verdict: "approved" | "rejected" | "pending";
  editing: boolean;
  onTrue: () => void;
  onFalse: () => void;
  onEdit: () => void;
  onSave: () => void;
}) {
  const t = COPY[lang];
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      <button type="button" onClick={onTrue} className={verdict === "approved" ? pillGood : pill}>
        {t.true}
      </button>
      <button type="button" onClick={onFalse} className={verdict === "rejected" ? pillMuted : pill}>
        {t.notTrue}
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
  guide = null,
  onTrue,
  onFalse,
  onAnswer: _onAnswer,
  onSaveEdit,
  onSkip,
  onUnskip,
  onToggleCollect,
  onOpenSource,
}: {
  lang: ClarityLang;
  block: QaBlock;
  guide?: WriteGuide | null;
  onTrue: (claimId: string) => void;
  onFalse: (claimId: string) => void;
  onAnswer: (text: string) => void;
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
  const [editingId, setEditingId] = useState<string | null>(
    !block.answer && (block.def.alwaysShow || claims.length === 0) ? "answer" : null,
  );
  const [draft, setDraft] = useState(block.answer || "");
  const customAnswer =
    Boolean(block.answer.trim()) && !claims.some((claim) => claim.text === block.answer);

  function startEdit(id: string, seed = "") {
    setEditingId(id);
    setDraft(block.answer.trim() ? block.answer : seed);
  }

  function saveEdit(claimId?: string) {
    const text = draft;
    if (text.trim() || block.answer.trim()) {
      onSaveEdit(text, claimId);
      onUnskip();
    }
    setEditingId(null);
  }

  return (
    <div className={skipped ? "rounded-[1.15rem] bg-[#f6f7f8] px-4 py-4" : ""}>
      <h3 className="text-start text-[15px] font-medium text-foreground">{questionLabel(block.def, lang)}</h3>
      {claims[0]?.sources[0] ? (
        <SourceLinks lang={lang} claim={claims[0]} source={claims[0].sources[0]} onOpenSource={onOpenSource} />
      ) : null}
      {!block.answer.trim() ? (
        <div className="mt-3">
          <WriteHint lang={lang} guide={guide} />
        </div>
      ) : null}

      <div className={skipped ? "opacity-60" : ""}>
        {claims.map((claim) => {
          const claimSource = claim.sources[0];
          const verdict = block.decisions[claim.id] || (block.answer === claim.text ? "approved" : "pending");
          const editing = editingId === claim.id;
          return (
            <div
              key={claim.id}
              className={`mt-3 rounded-[1.2rem] border p-4 ${
                verdict === "approved"
                  ? "border-emerald-100 bg-emerald-50/50"
                  : verdict === "rejected"
                    ? "border-transparent bg-[#f6f7f8]"
                    : "border-black/[0.08] bg-[#f7f8fa]"
              }`}
            >
              {editing ? (
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  placeholder={qaPlaceholder(block.def, lang) || t.writeProcess}
                  className="w-full resize-y rounded-[1.1rem] border border-assis-blue/20 bg-white px-3.5 py-3 text-start text-base leading-relaxed text-foreground outline-none focus:border-assis-blue/40 focus:ring-4 focus:ring-assis-blue/10 sm:text-[14px]"
                  dir={textDir}
                />
              ) : (
                <p
                  className={`whitespace-pre-wrap text-start text-[14px] leading-relaxed ${
                    verdict === "rejected" ? "text-zinc-400" : "text-foreground"
                  }`}
                  dir={textDir}
                >
                  {verdict === "approved" && block.answer.trim() ? block.answer : claim.text}
                </p>
              )}
              {claimSource ? (
                <SourceLinks lang={lang} claim={claim} source={claimSource} onOpenSource={onOpenSource} />
              ) : null}
              <VerdictBar
                lang={lang}
                verdict={verdict === "approved" || verdict === "rejected" ? verdict : "pending"}
                editing={editing}
                onTrue={() => {
                  setEditingId(null);
                  onTrue(claim.id);
                }}
                onFalse={() => {
                  setEditingId(null);
                  onFalse(claim.id);
                }}
                onEdit={() => startEdit(claim.id, claim.text)}
                onSave={() => saveEdit(claim.id)}
              />
            </div>
          );
        })}

        {claims.length === 0 || customAnswer || editingId === "answer" ? (
          <div className="mt-3 rounded-[1.2rem] border border-black/[0.08] bg-white p-4">
            {claims.length > 0 ? <p className="text-[13px] text-zinc-500">{t.writeYourself}</p> : null}
            {!block.answer && block.def.alwaysShow && editingId !== "answer" ? (
              <p className="text-[13px] text-zinc-500">{t.processWriteHint}</p>
            ) : null}
            {editingId === "answer" || (!block.answer.trim() && claims.length === 0) ? (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={block.def.alwaysShow ? 4 : 3}
                placeholder={qaPlaceholder(block.def, lang) || t.writeProcess}
                className="mt-2 w-full resize-y rounded-[1.1rem] border border-assis-blue/20 bg-[#f7f8fa] px-3.5 py-3 text-start text-base leading-relaxed text-foreground outline-none focus:border-assis-blue/40 focus:ring-4 focus:ring-assis-blue/10 sm:text-[14px]"
                dir={textDir}
              />
            ) : customAnswer ? (
              <p className="mt-2 whitespace-pre-wrap text-start text-[14px] leading-relaxed text-foreground" dir={textDir}>
                {block.answer}
              </p>
            ) : null}
            <VerdictBar
              lang={lang}
              verdict={skipped ? "rejected" : block.answer.trim() ? "approved" : "pending"}
              editing={editingId === "answer"}
              onTrue={() => {
                setEditingId(null);
                onUnskip();
              }}
              onFalse={onSkip}
              onEdit={() => startEdit("answer")}
              onSave={() => saveEdit()}
            />
          </div>
        ) : null}

        {qaChipSet(block.def) ? (
          <ChoiceChips
            lang={lang}
            set={qaChipSet(block.def)!}
            selected={block.collectFields}
            onToggle={onToggleCollect}
          />
        ) : null}
      </div>
    </div>
  );
}

function CustomQaBlock({
  lang,
  item,
  guide = null,
  suggestions,
  onChange,
  onToggleSkip,
  onToggleCollect,
  onOpenSource,
}: {
  lang: ClarityLang;
  item: CustomQaItem;
  guide?: WriteGuide | null;
  suggestions: ExtractedClaim[];
  onChange: (patch: Partial<CustomQaItem>) => void;
  onToggleSkip: () => void;
  onToggleCollect: (fieldId: string) => void;
  onOpenSource: (value: { claim: ExtractedClaim; source: ClaimSource }) => void;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const skipped = Boolean(item.skipped);
  const textDir = he ? "rtl" : "ltr";
  const detailName = item.detailName?.trim() || "";
  const questionText = item.question.trim() && item.question.trim() !== detailName ? item.question.trim() : "";
  const [showQuestion, setShowQuestion] = useState(!questionText && !item.answer.trim());
  const [editing, setEditing] = useState(!item.answer.trim());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  const [draft, setDraft] = useState(item.answer);
  const forCustomers = item.forCustomers !== false;
  const verdict = skipped ? "rejected" : item.verdict === "approved" ? "approved" : item.answer.trim() ? "pending" : "pending";
  const visibleSuggestions = suggestions.filter((claim) => !rejectedIds.has(claim.id));
  const answerMatchesSuggestion = visibleSuggestions.some((claim) => claim.text === item.answer.trim());
  const answerClaim =
    suggestions.find((claim) => claim.text === item.answer.trim() || claim.text === item.suggestedAnswer) || null;
  const answerSource = answerClaim?.sources[0] || null;
  const primaryClaim = answerClaim || visibleSuggestions[0] || null;
  const primarySource = answerSource || primaryClaim?.sources[0] || null;
  const showAnswerCard = Boolean(item.answer.trim() || editing || item.suggestedAnswer) && !answerMatchesSuggestion;
  const scanHint = Boolean(item.suggestedAnswer && item.answer.trim() === item.suggestedAnswer.trim());

  function saveEdit() {
    onChange({ answer: draft, skipped: false, verdict: draft.trim() ? "approved" : item.verdict });
    setEditing(false);
  }

  return (
    <div className={skipped ? "rounded-[1.15rem] bg-[#f6f7f8] px-4 py-4" : ""}>
      {questionText && !showQuestion ? (
        <h3 className="text-start text-[15px] font-medium text-foreground" dir={textDir}>
          {questionText}
        </h3>
      ) : showQuestion ? (
          <input
            value={item.question}
            onChange={(e) => onChange({ question: e.target.value, skipped: false })}
            placeholder={t.questionPlaceholder}
            className="w-full rounded-[0.9rem] border border-black/[0.08] bg-[#f7f8fa] px-3 py-2.5 text-start text-base font-medium text-foreground outline-none focus:border-assis-blue/25 focus:ring-4 focus:ring-assis-blue/10 sm:text-[14px]"
            dir={textDir}
          />
      ) : (
        <button
          type="button"
          onClick={() => setShowQuestion(true)}
          className="text-[12px] font-medium text-assis-blue hover:text-assis-blue-deep"
        >
          + {t.optionalQuestion}
        </button>
      )}

      {primaryClaim && primarySource ? (
        <SourceLinks lang={lang} claim={primaryClaim} source={primarySource} onOpenSource={onOpenSource} />
      ) : null}

      {item.section === "process" && !item.answer.trim() ? (
        <div className="mt-3">
          <WriteHint lang={lang} guide={guide} />
        </div>
      ) : null}

      <div className={skipped ? "opacity-60" : ""}>
        {visibleSuggestions.length > 0 ? (
          <p className="mt-3 text-[12px] font-medium text-zinc-500">{t.foundOnSite}</p>
        ) : scanHint ? (
          <p className="mt-3 text-[12px] font-medium text-zinc-500">{t.scanSuggestion}</p>
        ) : null}

        {visibleSuggestions.map((claim) => {
          const claimSource = claim.sources[0];
          const approved = item.answer.trim() === claim.text && item.verdict === "approved";
          return (
            <div
              key={claim.id}
              className={`mt-3 rounded-[1.2rem] border p-4 ${
                approved
                  ? "border-emerald-100 bg-emerald-50/50"
                  : "border-black/[0.08] bg-[#f7f8fa]"
              }`}
            >
              <p className="whitespace-pre-wrap text-start text-[14px] leading-relaxed text-foreground" dir={textDir}>
                {claim.text}
              </p>
              {claimSource ? (
                <SourceLinks lang={lang} claim={claim} source={claimSource} onOpenSource={onOpenSource} />
              ) : null}
              <VerdictBar
                lang={lang}
                verdict={approved ? "approved" : "pending"}
                editing={false}
                onTrue={() =>
                  onChange({ answer: claim.text, suggestedAnswer: item.suggestedAnswer || claim.text, skipped: false, verdict: "approved" })
                }
                onFalse={() => {
                  setRejectedIds((prev) => new Set(prev).add(claim.id));
                  if (item.answer.trim() === claim.text) {
                    onChange({ answer: "", verdict: "pending", skipped: false });
                  }
                }}
                onEdit={() => {
                  setDraft(claim.text);
                  setEditing(true);
                  onChange({ answer: claim.text, skipped: false, verdict: "pending" });
                }}
                onSave={() => undefined}
              />
            </div>
          );
        })}

        {showAnswerCard || visibleSuggestions.length === 0 ? (
          <div className="mt-3 rounded-[1.2rem] border border-black/[0.08] bg-white p-4">
            {visibleSuggestions.length > 0 ? <p className="text-[13px] text-zinc-500">{t.writeYourself}</p> : null}
            {scanHint && visibleSuggestions.length === 0 ? (
              <p className="mb-2 text-[12px] font-medium text-zinc-500">{t.scanSuggestion}</p>
            ) : null}
            {editing || !item.answer.trim() ? (
              <textarea
                value={editing ? draft : item.answer}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (!editing) setEditing(true);
                  onChange({ answer: e.target.value, skipped: false, verdict: "pending" });
                }}
                rows={4}
                placeholder={t.answerPlaceholder}
                className="w-full resize-y rounded-[1.1rem] border border-assis-blue/20 bg-[#f7f8fa] px-3.5 py-3 text-start text-base leading-relaxed text-foreground outline-none focus:border-assis-blue/40 focus:ring-4 focus:ring-assis-blue/10 sm:text-[14px]"
                dir={textDir}
              />
            ) : (
              <p className="whitespace-pre-wrap text-start text-[14px] leading-relaxed text-foreground" dir={textDir}>
                {item.answer}
              </p>
            )}
            {answerClaim && answerSource ? (
              <SourceLinks lang={lang} claim={answerClaim} source={answerSource} onOpenSource={onOpenSource} />
            ) : null}
            <VerdictBar
              lang={lang}
              verdict={verdict === "rejected" || verdict === "approved" ? verdict : "pending"}
              editing={editing}
              onTrue={() => {
                if (skipped) onToggleSkip();
                onChange({ verdict: "approved", skipped: false, answer: (editing ? draft : item.answer).trim() || item.answer });
                setEditing(false);
              }}
              onFalse={() => {
                if (answerClaim) setRejectedIds((prev) => new Set(prev).add(answerClaim.id));
                onChange({
                  answer: "",
                  suggestedAnswer: "",
                  verdict: "pending",
                  skipped: false,
                });
                setDraft("");
                setEditing(true);
              }}
              onEdit={() => {
                if (skipped) onToggleSkip();
                setDraft(item.answer);
                setEditing(true);
              }}
              onSave={saveEdit}
            />
          </div>
        ) : null}

        {item.section === "process" ? (
          <ChoiceChips lang={lang} set="collect" selected={item.collectFields || []} onToggle={onToggleCollect} />
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange({ forCustomers: true, skipped: false })}
          className={forCustomers ? pillDark : pill}
        >
          {t.forCustomers}
        </button>
        <button
          type="button"
          onClick={() => onChange({ forCustomers: false, skipped: false })}
          className={!forCustomers ? pillDark : pill}
        >
          {t.agentOnly}
        </button>
      </div>
    </div>
  );
}

function ChoiceChips({
  lang,
  set,
  selected,
  onToggle,
}: {
  lang: ClarityLang;
  set: ChipSetId;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const [other, setOther] = useState("");
  const fields = CHIP_SETS[set];
  const customIds = selected.filter((id) => id.startsWith("custom:"));

  return (
    <div className="mt-3">
      <p className="text-start text-[12px] font-medium text-zinc-500">{chipHint(set, lang)}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {fields.map((field) => {
          const on = selected.includes(field.id);
          return (
            <button key={field.id} type="button" onClick={() => onToggle(field.id)} className={on ? pillDark : pill}>
              {he ? field.he : field.en}
            </button>
          );
        })}
        {customIds.map((id) => (
          <button key={id} type="button" onClick={() => onToggle(id)} className={pillDark}>
            {chipLabel(set, id, lang)}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <input
          value={other}
          onChange={(e) => setOther(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            const label = other.trim();
            if (!label) return;
            onToggle(`custom:${label}`);
            setOther("");
          }}
          placeholder={t.collectOther}
          className="h-11 min-w-[8rem] flex-1 rounded-full border border-black/[0.06] bg-white px-3 text-base text-foreground outline-none focus:border-assis-blue/25 sm:h-7 sm:text-[11px]"
          dir={he ? "rtl" : "ltr"}
        />
        <button
          type="button"
          onClick={() => {
            const label = other.trim();
            if (!label) return;
            onToggle(`custom:${label}`);
            setOther("");
          }}
          className={pill}
        >
          {t.collectOtherAdd}
        </button>
      </div>
    </div>
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
  onClose,
}: {
  lang: ClarityLang;
  claim: ExtractedClaim;
  source: ClaimSource;
  onClose: () => void;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const label = friendlyPageLabel(source, he ? "עמוד הבית" : "Home");
  const excerpt = source.excerpt || claim.text;
  const parts = excerpt.split(claim.text);
  const exactUrl = textFragmentUrl(source.url, claim.text);
  const previewUrl = `/api/clarity/preview?url=${encodeURIComponent(source.url)}&quote=${encodeURIComponent(claim.text)}&excerpt=${encodeURIComponent(excerpt.slice(0, 240))}`;
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
