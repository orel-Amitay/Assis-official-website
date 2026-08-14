"use client";

import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import { approvedPageCategories } from "@/lib/clarity/site-page";
import type { ReviewState, ScanResult } from "@/lib/clarity/types";
import KnowledgeExport from "./KnowledgeExport";
import MaterialIcon from "./MaterialIcon";

export default function KnowledgeScreen({
  lang,
  result,
  state,
  onBack,
  onRescan,
}: {
  lang: ClarityLang;
  result: ScanResult;
  state: ReviewState;
  onBack: () => void;
  onRescan: () => void;
}) {
  const t = COPY[lang];
  const categories = approvedPageCategories(result, state, lang);
  const hasPage = categories.length > 0;

  return (
    <main className="mx-auto max-w-2xl px-5 pb-16 pt-10 sm:px-8 sm:pt-12">
      <button
        type="button"
        onClick={onBack}
        className="text-[13px] font-medium text-muted-foreground transition hover:text-assis-blue"
      >
        {t.backToReview}
      </button>

      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-assis-blue/80">
        {t.knowledgeEyebrow}
      </p>
      <h1 className="font-display mt-2 text-[1.75rem] font-semibold tracking-[-0.04em] text-foreground sm:text-3xl">
        {t.knowledgeTitle}
      </h1>
      <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
        {t.knowledgeBody}
      </p>

      {hasPage ? <KnowledgeExport lang={lang} result={result} state={state} highlight /> : null}

      {!hasPage ? (
        <p className="mt-8 rounded-[1.35rem] border border-black/[0.05] bg-white/70 px-5 py-6 text-sm text-muted-foreground">
          {t.emptyKb}
        </p>
      ) : (
        <section className="mt-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            {t.pagePreview}
          </p>
          <div className="mt-3 overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03),0_16px_40px_-24px_rgba(16,24,40,0.18)]">
            <div className="border-b border-black/[0.04] px-5 py-3 text-[12px] text-zinc-400" dir="ltr">
              {result.storeUrl.replace(/\/$/, "")}
            </div>
            <div className="space-y-7 px-5 py-6 sm:px-7 sm:py-8">
              {categories.map((category) => (
                <div key={category.name}>
                  <h3 className="text-[13px] font-semibold text-assis-blue">{category.name}</h3>
                  <div className="mt-3 space-y-5">
                    {category.sections.map((section) => (
                      <div key={section.detailName}>
                        <h4 className="text-[15px] font-medium text-foreground">{section.detailName}</h4>
                        {section.detailContent.map((item, index) => (
                          <div key={`${section.detailName}-${index}`} className="mt-2">
                            {item.question ? (
                              <p className="text-[13px] font-medium text-zinc-700">{item.question}</p>
                            ) : null}
                            <p className="mt-0.5 text-[14px] leading-relaxed text-zinc-600" dir="auto">
                              {item.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={onRescan}
        className="mt-8 inline-flex items-center gap-1 text-[13px] font-medium text-zinc-400 transition hover:text-foreground"
      >
        <MaterialIcon name="refresh" className="text-[16px]" />
        {t.rescan}
      </button>
    </main>
  );
}
