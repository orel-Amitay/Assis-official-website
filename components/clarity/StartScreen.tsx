"use client";

import { useState } from "react";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import type { ClarityDraftMeta } from "@/lib/clarity/draft";
import ClarityAuthForm from "./ClarityAuthForm";
import ClarityGuide, { useClarityGuide } from "./ClarityGuide";

export default function StartScreen({
  lang,
  url,
  onUrlChange,
  onScan,
  onDemo,
  drafts,
  signedIn,
  accountLabel,
  onResumeDraft,
  onDeleteDraft,
  onImportDraft,
  isAdmin,
}: {
  lang: ClarityLang;
  url: string;
  onUrlChange: (value: string) => void;
  onScan: () => void;
  onDemo: () => void;
  drafts: ClarityDraftMeta[];
  signedIn?: boolean;
  accountLabel?: string;
  onResumeDraft: (id: string) => void;
  onDeleteDraft: (id: string) => void;
  onImportDraft: (file: File) => void;
  isAdmin?: boolean;
}) {
  const t = COPY[lang];
  const guide = useClarityGuide(Boolean(signedIn));
  const [pendingDelete, setPendingDelete] = useState<ClarityDraftMeta | null>(null);

  if (!signedIn) {
    return (
      <main className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center px-4 pb-[max(4rem,env(safe-area-inset-bottom))] pt-8 sm:px-8 sm:pt-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-assis-blue">
          {t.product}
        </p>
        <h1 className="font-display mt-3 text-[1.85rem] font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
          {t.signInTitle}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{t.signInBody}</p>
        <div className="mt-8 rounded-[1.6rem] border border-black/[0.05] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_18px_40px_-28px_rgba(16,24,40,0.2)]">
          <ClarityAuthForm lang={lang} />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-4 pb-[max(4rem,env(safe-area-inset-bottom))] pt-8 sm:px-8 sm:pt-16">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-assis-blue">
        {t.startEyebrow}
      </p>
      <h1 className="font-display mt-3 text-[1.85rem] font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
        {t.startTitle}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        {t.startBody}
      </p>
      {accountLabel ? (
        <p className="mt-2 text-[13px] text-zinc-400">{t.signedInAs.replace("{name}", accountLabel)}</p>
      ) : null}
      {isAdmin ? (
        <a
          href="/clarity/admin"
          className="mt-3 inline-flex text-[13px] font-semibold text-assis-blue hover:underline"
        >
          {t.adminCta}
        </a>
      ) : null}

      <section className="mt-8 rounded-[1.4rem] border border-black/[0.05] bg-white/90 p-4 shadow-sm">
        <p className="text-[12px] font-semibold text-foreground">{t.draftsTitle}</p>
        {drafts.length === 0 ? (
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{t.draftsEmpty}</p>
        ) : (
          <div className="mt-3 space-y-2">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="flex flex-col gap-3 rounded-[1.1rem] bg-[#f7f8fa] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-foreground">{draft.storeName}</p>
                  <p className="mt-0.5 break-all text-[12px] text-zinc-400">
                    <span dir="ltr">{draft.storeUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
                    {" · "}
                    {t.draftPages.replace("{n}", String(draft.pages))}
                    {" · "}
                    {new Date(draft.savedAt).toLocaleString(lang === "he" ? "he-IL" : "en-GB", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onResumeDraft(draft.id)}
                    className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-assis-blue px-4 text-[13px] font-semibold text-white sm:h-9 sm:flex-none sm:px-3 sm:text-[12px]"
                  >
                    {t.resumeDraft}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(draft)}
                    className="inline-flex h-11 items-center rounded-full px-3 text-[13px] font-medium text-zinc-500 ring-1 ring-black/[0.06] transition hover:text-red-700 hover:ring-red-200 sm:h-9 sm:text-[12px]"
                  >
                    {t.deleteDraft}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-[1.4rem] border border-assis-blue/15 bg-assis-blue/[0.04] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13px] font-semibold text-foreground">{t.guideTitle}</p>
          <button
            type="button"
            onClick={guide.show}
            className="text-[12px] font-medium text-assis-blue hover:text-assis-blue-deep"
          >
            {t.guideCta}
          </button>
        </div>
        <ol className="mt-3 space-y-2">
          {t.startSteps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-[14px] leading-relaxed text-foreground">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-assis-blue-deep">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <ClarityGuide lang={lang} open={guide.open} onClose={guide.close} />
      {pendingDelete ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-zinc-900/25 p-4 backdrop-blur-[2px] sm:items-center"
          onClick={() => setPendingDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-[1.5rem] border border-white/70 bg-white p-5 shadow-[0_24px_60px_-28px_rgba(16,24,40,0.35)] sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-assis-blue/80">
              {t.deleteDraftTitle}
            </p>
            <p className="mt-3 text-[15px] font-semibold text-foreground">{pendingDelete.storeName}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{t.deleteDraftBody}</p>
            <button
              type="button"
              onClick={() => {
                onDeleteDraft(pendingDelete.id);
                setPendingDelete(null);
              }}
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-red-600 text-[13px] font-semibold text-white transition hover:bg-red-700"
            >
              {t.deleteDraftConfirm}
            </button>
            <button
              type="button"
              onClick={() => setPendingDelete(null)}
              className="mt-1.5 inline-flex h-10 w-full items-center justify-center rounded-full text-[13px] font-medium text-muted-foreground transition hover:text-foreground"
            >
              {t.deleteDraftCancel}
            </button>
          </div>
        </div>
      ) : null}

      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onScan();
        }}
      >
        <label className="block text-[13px] font-semibold text-foreground" htmlFor="store-url">
          {t.urlLabel}
        </label>
        <input
          id="store-url"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder={t.urlPlaceholder}
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="h-12 w-full rounded-2xl border border-border bg-white/90 px-4 text-base text-foreground outline-none transition placeholder:text-zinc-400 focus:border-assis-blue/40 focus:ring-4 focus:ring-assis-blue/10"
          dir="ltr"
        />
        <p className="text-[12px] leading-relaxed text-muted-foreground">{t.urlHint}</p>
        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-assis-blue text-sm font-semibold text-white transition hover:bg-assis-blue-deep"
        >
          {t.scanCta}
        </button>
      </form>

      <button
        type="button"
        onClick={onDemo}
        className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-white/80 text-sm font-semibold text-foreground transition hover:bg-white"
      >
        {t.demoCta}
      </button>

      <label className="mt-3 flex h-12 w-full cursor-pointer items-center justify-center rounded-full text-sm font-semibold text-assis-blue/80 transition hover:text-assis-blue">
        {t.importDraft}
        <input
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportDraft(file);
            e.currentTarget.value = "";
          }}
        />
      </label>
    </main>
  );
}
