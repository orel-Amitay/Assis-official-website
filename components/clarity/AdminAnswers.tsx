"use client";

import { useEffect, useMemo, useState } from "react";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import { shortDashes } from "@/lib/clarity/text";
import type { AdminDraftAnswers } from "@/lib/clarity/admin-types";
import { knowledgeFileSlug } from "@/lib/clarity/knowledge-export";
import { countQaFilters, customFilterFlags, matchesQaFilters, type QaFilter } from "@/lib/clarity/qa-filters";
import { GROUPS } from "@/lib/clarity/topics";
import ClarityShell from "./ClarityShell";
import QaFilterBar from "./QaFilterBar";

type QaStatus = "approved" | "rejected" | "pending" | "missing" | "na";
type AdminItem = AdminDraftAnswers["questionnaire"][number];
type AdminCategory = {
  id: string;
  title: string;
  titleHe: string;
  done: number;
  total: number;
  details: Array<{ detailName: string; items: AdminItem[] }>;
};

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: "application/json;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}

function exportDraft(draft: AdminDraftAnswers) {
  return {
    storeName: draft.storeName,
    storeUrl: draft.storeUrl,
    savedAt: draft.savedAt,
    user: { email: draft.email, name: draft.name, username: draft.username, userId: draft.userId },
    sections: draft.answers,
    questionnaire: draft.questionnaire,
  };
}

function itemStatus(item: AdminItem): QaStatus {
  if (item.notApplicable || item.skipped) return "na";
  if (item.verdict === "approved") return "approved";
  if (item.verdict === "rejected") return "rejected";
  if (!item.answer.trim()) return "missing";
  return "pending";
}

function itemDone(item: AdminItem) {
  return Boolean(item.skipped || item.notApplicable || item.verdict === "approved");
}

function statusTone(status: QaStatus) {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200";
    case "rejected":
    case "missing":
      return "bg-orange-50 text-orange-900 ring-1 ring-orange-200";
    case "pending":
      return "bg-amber-50 text-amber-900 ring-1 ring-amber-200";
    default:
      return "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200";
  }
}

function statusLabel(lang: ClarityLang, status: QaStatus) {
  const t = COPY[lang];
  if (status === "approved") return t.true;
  if (status === "rejected") return t.fixAnswer;
  if (status === "missing") return t.mustFill;
  if (status === "pending") return t.needsConfirm;
  return t.statusNa;
}

const pill =
  "inline-flex min-h-7 items-center rounded-full border border-black/[0.08] bg-white px-2.5 text-[11px] font-medium text-zinc-600";
const pillGood =
  "inline-flex min-h-7 items-center rounded-full bg-emerald-50 px-2.5 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-200/80";
const pillWarn =
  "inline-flex min-h-7 items-center rounded-full bg-orange-50 px-2.5 text-[11px] font-medium text-orange-900 ring-1 ring-orange-200";
const pillMuted =
  "inline-flex min-h-7 items-center rounded-full bg-zinc-200 px-2.5 text-[11px] font-medium text-zinc-500";

function categoriesFromDraft(draft: AdminDraftAnswers, lang: ClarityLang): AdminCategory[] {
  const items = draft.questionnaire || [];
  if (items.length > 0) {
    return GROUPS.map((group) => {
      const list = items.filter((item) => item.groupId === group.id);
      const order: string[] = [];
      const map = new Map<string, AdminItem[]>();
      for (const item of list) {
        const name = item.detailName?.trim() || (lang === "he" ? group.titleHe : group.title);
        if (!map.has(name)) {
          order.push(name);
          map.set(name, []);
        }
        map.get(name)!.push(item);
      }
      return {
        id: group.id,
        title: group.title,
        titleHe: group.titleHe,
        done: list.filter(itemDone).length,
        total: list.length,
        details: order.map((detailName) => ({ detailName, items: map.get(detailName)! })),
      };
    }).filter((group) => group.total > 0);
  }

  return (draft.answers || []).map((category, index) => {
    const details = category.sections.map((section) => ({
      detailName: section.detailName,
      items: section.detailContent.map((qa, qaIndex) => ({
        id: `${category.name}-${section.detailName}-${qaIndex}`,
        groupId: category.name,
        detailName: section.detailName,
        question: qa.question || section.detailName,
        answer: qa.notApplicable ? "" : qa.answer,
        notApplicable: qa.notApplicable,
        skipped: qa.notApplicable,
        verdict: qa.approval === "approved" ? "approved" : "pending",
      })),
    }));
    const all = details.flatMap((detail) => detail.items);
    return {
      id: `cat-${index}`,
      title: category.name,
      titleHe: category.name,
      done: all.filter(itemDone).length,
      total: all.length,
      details,
    };
  });
}

export default function AdminAnswers({ lang: initialLang = "he" }: { lang?: ClarityLang }) {
  const [lang, setLang] = useState<ClarityLang>(initialLang);
  const t = COPY[lang];
  const he = lang === "he";
  const [drafts, setDrafts] = useState<AdminDraftAnswers[] | null>(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState("");
  const [activeGroup, setActiveGroup] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(`/api/clarity/admin/answers?t=${Date.now()}`, { cache: "no-store" });
        if (response.status === 403) {
          if (!cancelled) setError(t.adminForbidden);
          return;
        }
        if (!response.ok) throw new Error("load");
        const data = (await response.json()) as { drafts?: AdminDraftAnswers[] };
        if (!cancelled) {
          setDrafts(Array.isArray(data.drafts) ? data.drafts : []);
          setUpdatedAt(new Date().toLocaleTimeString(he ? "he-IL" : "en-GB"));
        }
      } catch {
        if (!cancelled) setError(t.adminForbidden);
      }
    }
    void load();
    const timer = window.setInterval(() => void load(), 800);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [he, t.adminForbidden]);

  const openDraft = drafts?.find((draft) => `${draft.userId}:${draft.draftId}` === openId) || null;
  const categories = useMemo(
    () => (openDraft ? categoriesFromDraft(openDraft, lang) : []),
    [openDraft, lang],
  );
  const active = categories.find((group) => group.id === activeGroup) || categories[0];
  const progressTotal = categories.reduce((sum, group) => sum + group.total, 0);
  const progressDone = categories.reduce((sum, group) => sum + group.done, 0);
  const progressLeft = Math.max(0, progressTotal - progressDone);
  const progressPct = progressTotal === 0 ? 0 : Math.round((progressDone / progressTotal) * 100);

  useEffect(() => {
    if (!categories.length) return;
    if (!categories.some((group) => group.id === activeGroup)) {
      setActiveGroup(categories[0].id);
    }
  }, [categories, activeGroup]);

  if (error) {
    return (
      <ClarityShell lang={lang} onToggleLang={() => setLang((prev) => (prev === "he" ? "en" : "he"))}>
        <main className="mx-auto max-w-xl px-4 py-16 sm:px-8">
          <p className="text-[15px] text-muted-foreground">{error}</p>
        </main>
      </ClarityShell>
    );
  }

  if (!drafts) {
    return (
      <ClarityShell lang={lang} onToggleLang={() => setLang((prev) => (prev === "he" ? "en" : "he"))}>
        <main className="mx-auto max-w-xl px-4 py-16 sm:px-8">
          <p className="text-[15px] text-muted-foreground">{he ? "טוענים…" : "Loading…"}</p>
        </main>
      </ClarityShell>
    );
  }

  return (
    <ClarityShell lang={lang} onToggleLang={() => setLang((prev) => (prev === "he" ? "en" : "he"))}>
      {openDraft && active ? (
        <AdminDraftView
          lang={lang}
          draft={openDraft}
          categories={categories}
          active={active}
          progressDone={progressDone}
          progressTotal={progressTotal}
          progressLeft={progressLeft}
          progressPct={progressPct}
          updatedAt={updatedAt}
          onBack={() => {
            setOpenId("");
            setActiveGroup("");
          }}
          onSelectGroup={setActiveGroup}
        />
      ) : (
        <AdminStoreList
          lang={lang}
          drafts={drafts}
          updatedAt={updatedAt}
          onOpen={(draft) => {
            setOpenId(`${draft.userId}:${draft.draftId}`);
            setActiveGroup("");
          }}
        />
      )}
    </ClarityShell>
  );
}

function AdminStoreList({
  lang,
  drafts,
  updatedAt,
  onOpen,
}: {
  lang: ClarityLang;
  drafts: AdminDraftAnswers[];
  updatedAt: string;
  onOpen: (draft: AdminDraftAnswers) => void;
}) {
  const t = COPY[lang];
  const he = lang === "he";

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-8 sm:pt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-assis-blue">{t.product}</p>
      <h1 className="font-display mt-3 text-[1.85rem] font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
        {t.adminTitle}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{t.adminBody}</p>
      <p className="mt-1 text-[12px] text-zinc-400">
        {t.adminLive}
        {updatedAt ? ` · ${updatedAt}` : ""}
      </p>
      {drafts.length > 0 ? (
        <button
          type="button"
          onClick={() =>
            downloadJson(`clarity-answers-${new Date().toISOString().slice(0, 10)}.json`, drafts.map(exportDraft))
          }
          className="mt-5 inline-flex h-10 items-center rounded-full bg-zinc-900 px-4 text-[13px] font-semibold text-white hover:bg-zinc-800"
        >
          {t.adminDownloadAll}
        </button>
      ) : null}

      {drafts.length === 0 ? (
        <p className="mt-10 text-[14px] text-muted-foreground">{t.adminEmpty}</p>
      ) : (
        <div className="mt-8 grid gap-3">
          {drafts.map((draft) => {
            const cats = categoriesFromDraft(draft, lang);
            const filled = cats.reduce((sum, group) => sum + group.done, 0);
            const total = cats.reduce((sum, group) => sum + group.total, 0);
            const pct = total === 0 ? 0 : Math.round((filled / total) * 100);
            const who = draft.email || draft.username || draft.name || draft.userId;
            return (
              <article
                key={`${draft.userId}:${draft.draftId}`}
                className="rounded-[1.5rem] border border-black/[0.05] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.03),0_16px_40px_-24px_rgba(16,24,40,0.18)] sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[17px] font-semibold tracking-[-0.03em] text-foreground">
                      {draft.storeName}
                    </p>
                    <p className="mt-0.5 break-all text-[12px] text-zinc-400" dir="ltr">
                      {draft.storeUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </p>
                    <p className="mt-2 text-[13px] text-zinc-600">
                      {t.adminUser}: <span className="font-semibold text-foreground">{who}</span>
                      {draft.deleted ? ` · ${t.adminDeleted}` : ""}
                    </p>
                    <p className="mt-0.5 text-[12px] text-zinc-500">
                      {t.adminUpdated}:{" "}
                      {new Date(draft.savedAt).toLocaleString(he ? "he-IL" : "en-GB", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpen(draft)}
                      className="inline-flex h-10 items-center rounded-full bg-assis-blue px-4 text-[13px] font-semibold text-white hover:bg-assis-blue-deep"
                    >
                      {t.adminOpen}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        downloadJson(
                          `clarity-${knowledgeFileSlug(draft.storeName)}-${draft.draftId.slice(0, 8)}.json`,
                          exportDraft(draft),
                        )
                      }
                      className="inline-flex h-10 items-center rounded-full border border-black/[0.08] bg-white px-3 text-[12px] font-medium text-zinc-600 hover:text-foreground"
                    >
                      {t.adminDownloadOne}
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[12px] font-semibold text-foreground">
                      {t.progressDone.replace("{done}", String(filled)).replace("{total}", String(total))}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      {total - filled > 0
                        ? t.progressLeft.replace("{n}", String(Math.max(0, total - filled)))
                        : t.allComplete}
                    </p>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-200/80">
                    <div className="h-full rounded-full bg-assis-blue" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

function AdminDraftView({
  lang,
  draft,
  categories,
  active,
  progressDone,
  progressTotal,
  progressLeft,
  progressPct,
  updatedAt,
  onBack,
  onSelectGroup,
}: {
  lang: ClarityLang;
  draft: AdminDraftAnswers;
  categories: AdminCategory[];
  active: AdminCategory;
  progressDone: number;
  progressTotal: number;
  progressLeft: number;
  progressPct: number;
  updatedAt: string;
  onBack: () => void;
  onSelectGroup: (id: string) => void;
}) {
  const t = COPY[lang];
  const he = lang === "he";
  const who = draft.email || draft.username || draft.name || draft.userId;
  const [filters, setFilters] = useState<QaFilter[]>([]);
  const filtering = filters.length > 0;
  const allItems = categories.flatMap((group) => group.details.flatMap((detail) => detail.items));
  const filterCounts = useMemo(() => countQaFilters(allItems), [allItems]);
  const displayCategories = useMemo(() => {
    if (!filtering) return [active];
    return categories
      .map((group) => ({
        ...group,
        details: group.details
          .map((detail) => ({
            ...detail,
            items: detail.items.filter((item) => matchesQaFilters(customFilterFlags(item), filters)),
          }))
          .filter((detail) => detail.items.length > 0),
      }))
      .filter((group) => group.details.length > 0);
  }, [active, categories, filters, filtering]);
  const navCategories = filtering ? displayCategories : categories;

  function selectGroup(id: string) {
    onSelectGroup(id);
    if (filtering) {
      window.setTimeout(() => {
        document.getElementById(`admin-group-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 40);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-2 sm:px-8 sm:pt-8">
      <div className="mb-2 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-w-0 truncate text-[12px] font-medium text-zinc-500 transition hover:text-foreground"
        >
          {t.adminBack}
        </button>
        <p className="max-w-[45%] truncate text-[11px] text-zinc-400">{draft.storeName}</p>
      </div>

      <div className="sticky top-0 z-30 -mx-4 border-b border-black/[0.05] bg-[#f7f8fa] px-4 py-2 sm:mx-0 sm:rounded-[1.3rem] sm:border sm:px-3 sm:py-2.5 [transform:translateZ(0)]">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 truncate text-[11px] font-semibold text-foreground sm:text-[12px]">
              {t.progressDone.replace("{done}", String(progressDone)).replace("{total}", String(progressTotal))}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <p className="text-[10px] font-medium text-zinc-500 sm:text-[11px]">
                {progressLeft > 0 ? t.progressLeft.replace("{n}", String(progressLeft)) : t.allComplete}
              </p>
              <QaFilterBar lang={lang} selected={filters} counts={filterCounts} onChange={setFilters} />
            </div>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-200/80">
            <div
              className="h-full rounded-full bg-assis-blue transition-[width] duration-200 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-1 truncate text-[10px] font-medium text-emerald-700">
            {t.adminLive}
            {updatedAt ? ` · ${updatedAt}` : ""}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[12px] text-zinc-500">
        {t.adminUser}: <span className="font-medium text-foreground">{who}</span>
        {" · "}
        {t.adminUpdated}:{" "}
        {new Date(draft.savedAt).toLocaleString(he ? "he-IL" : "en-GB", {
          dateStyle: "short",
          timeStyle: "short",
        })}
      </p>

      <div className="mt-3 lg:hidden -mx-4 px-4 sm:mx-0 sm:mt-4 sm:px-0">
        <div className="flex gap-1.5 overflow-x-auto pb-1 pe-6 no-scrollbar">
          {navCategories.map((group) => (
            <button
              key={group.id}
              type="button"
              onClick={() => selectGroup(group.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                active.id === group.id
                  ? "bg-assis-blue text-white"
                  : group.done >= group.total
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-white/80 text-muted-foreground"
              }`}
            >
              {he ? group.titleHe : group.title}
              <span className={`ms-1.5 text-[10px] ${active.id === group.id ? "text-white/80" : "text-zinc-400"}`}>
                {group.done}/{group.total}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 lg:flex lg:items-start lg:gap-8">
        <nav className="hidden w-64 shrink-0 lg:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">{t.categoriesNav}</p>
          <div className="sticky top-28 mt-3 space-y-1">
            {navCategories.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => selectGroup(group.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-2xl px-3 py-2.5 text-start transition ${
                  active.id === group.id
                    ? "bg-assis-blue-light text-assis-blue-deep shadow-sm"
                    : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
                }`}
              >
                <span className="min-w-0 text-[13px] font-medium leading-snug">
                  {he ? group.titleHe : group.title}
                </span>
                <span className={`shrink-0 text-[11px] ${active.id === group.id ? "text-assis-blue-deep/70" : "text-zinc-400"}`}>
                  {group.done >= group.total && group.total > 0 ? "✓" : `${group.done}/${group.total}`}
                </span>
              </button>
            ))}
          </div>
        </nav>

        <div className="min-w-0 flex-1">
          <article className="overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03),0_16px_40px_-24px_rgba(16,24,40,0.18)]">
            <div className="hidden overflow-x-auto border-b border-black/[0.04] px-4 py-3 text-[12px] text-zinc-400 sm:block sm:px-5" dir="ltr">
              {draft.storeUrl.replace(/\/$/, "")}
            </div>
            <div className="space-y-8 px-4 py-5 sm:px-7 sm:py-8">
              {filtering && displayCategories.length === 0 ? (
                <p className="text-[14px] text-muted-foreground">{t.filterEmpty}</p>
              ) : null}

              {displayCategories.map((group) => (
                <div key={group.id} id={`admin-group-${group.id}`} className="space-y-5">
                  <div>
                    <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-foreground">
                      {he ? group.titleHe : group.title}
                    </h2>
                    <p className="mt-2 text-[13px] text-zinc-500">
                      {filtering
                        ? group.details.reduce((sum, detail) => sum + detail.items.length, 0)
                        : `${group.done}/${group.total}${
                            group.done < group.total
                              ? ` · ${t.categoryLeft.replace("{n}", String(group.total - group.done))}`
                              : ` · ${t.categoryDoneAll}`
                          }`}
                    </p>
                  </div>

                  {group.details.map(({ detailName, items }) => (
                    <section
                      key={`${group.id}-${detailName}`}
                      className="overflow-hidden rounded-[1.35rem] border border-black/[0.06] bg-white"
                    >
                      <header className="border-b border-black/[0.05] px-4 py-3 sm:px-5">
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-foreground">{detailName}</h3>
                      </header>
                      <div className="space-y-4 px-4 py-4 sm:px-5">
                        {items.map((item) => {
                          const status = itemStatus(item);
                          const edited = Boolean(
                            item.answer?.trim() &&
                              item.suggestedAnswer?.trim() &&
                              item.answer.trim() !== item.suggestedAnswer.trim(),
                          );
                          return (
                            <div
                              key={item.id}
                              className={
                                status === "na"
                                  ? "rounded-[1.15rem] bg-zinc-100/80 px-4 py-4 ring-1 ring-zinc-200"
                                  : status === "missing" || status === "rejected"
                                    ? "rounded-[1.15rem] bg-orange-50/90 px-4 py-4 ring-1 ring-orange-200"
                                    : "border-t border-black/[0.05] pt-4 first:border-t-0 first:pt-0"
                              }
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-[11px] font-medium text-zinc-400">{t.questionLabel}</p>
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusTone(status)}`}>
                                  {statusLabel(lang, status)}
                                </span>
                                {edited ? (
                                  <span className="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-800 ring-1 ring-sky-200">
                                    {t.statusEdited}
                                  </span>
                                ) : null}
                              </div>
                              <h4 className="mt-1 text-[15px] font-medium text-foreground">{item.question}</h4>
                              {status === "rejected" ? (
                                <p className="mt-1 text-[12px] leading-relaxed text-orange-800">{t.fixAnswerHint}</p>
                              ) : status === "missing" ? (
                                <p className="mt-1 text-[12px] leading-relaxed text-orange-800">{t.mustFillHint}</p>
                              ) : null}
                              <p className="mt-3 text-[11px] font-medium text-zinc-400">{t.answerLabel}</p>
                              <p className="mt-1 whitespace-pre-wrap text-[14px] leading-relaxed text-foreground">
                                {shortDashes(item.answer) || "-"}
                              </p>
                              {item.sourceUrl ? (
                                <a
                                  href={item.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-assis-blue"
                                >
                                  {item.sourceTitle || item.sourceUrl}
                                </a>
                              ) : null}
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                <span className={status === "approved" ? pillGood : pill}>{t.true}</span>
                                <span className={status === "rejected" ? pillWarn : pill}>{t.notTrue}</span>
                                <span className={status === "na" ? pillMuted : pill}>{t.markNa}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
