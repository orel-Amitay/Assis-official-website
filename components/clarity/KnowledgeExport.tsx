"use client";

import { useState } from "react";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import {
  downloadKnowledgeJson,
  downloadKnowledgePdf,
  downloadKnowledgeTxt,
} from "@/lib/clarity/knowledge-export";
import { knowledgeJson, knowledgeJsonText } from "@/lib/clarity/review-state";
import type { ReviewState, ScanResult } from "@/lib/clarity/types";
import MaterialIcon from "./MaterialIcon";

export default function KnowledgeExport({
  lang,
  result,
  state,
  highlight = false,
  onDownloadDraft,
}: {
  lang: ClarityLang;
  result: ScanResult;
  state: ReviewState;
  highlight?: boolean;
  onDownloadDraft?: () => void;
}) {
  const t = COPY[lang];
  const [copied, setCopied] = useState(false);
  const hasContent = knowledgeJson(result, state, lang).length > 0;

  async function copyJson() {
    await navigator.clipboard.writeText(knowledgeJsonText(result, state, lang));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section
      className={`mt-4 rounded-[1.35rem] border px-4 py-4 sm:px-5 sm:py-5 ${
        highlight
          ? "border-assis-blue/25 bg-assis-blue/[0.06]"
          : "border-black/[0.06] bg-white/80"
      }`}
    >
      <h2 className="font-display text-[1.05rem] font-semibold tracking-[-0.03em] text-foreground sm:text-lg">
        {highlight ? t.exportTitleDone : t.exportTitle}
      </h2>
      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
        {highlight ? t.exportBodyDone : t.exportBody}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => downloadKnowledgeJson(result, state, lang)}
          disabled={!hasContent}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-assis-blue px-4 text-[13px] font-semibold text-white transition hover:bg-assis-blue-deep disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 sm:h-9 sm:flex-none"
        >
          {t.downloadKb}
        </button>
        <button
          type="button"
          onClick={() => downloadKnowledgeTxt(result, state, lang)}
          disabled={!hasContent}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-black/[0.08] bg-white px-4 text-[13px] font-semibold text-foreground transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:flex-none"
        >
          {t.downloadTxt}
        </button>
        <button
          type="button"
          onClick={() => downloadKnowledgePdf(result, state, lang)}
          disabled={!hasContent}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-black/[0.08] bg-white px-4 text-[13px] font-semibold text-foreground transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:flex-none"
        >
          {t.downloadPdf}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
        <button
          type="button"
          onClick={copyJson}
          disabled={!hasContent}
          className="font-medium text-zinc-500 transition hover:text-foreground disabled:opacity-40"
        >
          {copied ? t.copied : t.copyKb}
        </button>
        {onDownloadDraft ? (
          <button
            type="button"
            onClick={onDownloadDraft}
            className="font-medium text-zinc-400 transition hover:text-foreground"
          >
            {t.downloadDraft}
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-[11px] text-zinc-400">{t.printPdfHint}</p>
    </section>
  );
}

export function KnowledgeExportMenu({
  lang,
  result,
  state,
  onDownloadDraft,
}: {
  lang: ClarityLang;
  result: ScanResult;
  state: ReviewState;
  onDownloadDraft?: () => void;
}) {
  const t = COPY[lang];
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-black/[0.08] bg-white px-2.5 text-[12px] font-semibold text-zinc-600 transition hover:text-foreground"
      >
        <MaterialIcon name="download" className="text-[16px]" />
        <span className="hidden sm:inline">{t.downloadMenu}</span>
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-zinc-900/25 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-[1.5rem] border border-white/70 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_24px_60px_-28px_rgba(16,24,40,0.35)] sm:rounded-[1.5rem] sm:p-5 sm:pb-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-1 flex items-center justify-between gap-3 px-1">
              <p className="text-[13px] font-semibold text-foreground">{t.downloadMenu}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[12px] font-medium text-zinc-400 transition hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <KnowledgeExport lang={lang} result={result} state={state} onDownloadDraft={onDownloadDraft} />
          </div>
        </div>
      ) : null}
    </>
  );
}
