"use client";

import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import {
  QA_FILTERS,
  qaFilterLabel,
  type QaFilter,
} from "@/lib/clarity/qa-filters";

export default function QaFilterBar({
  lang,
  selected,
  counts,
  onChange,
  compact = false,
}: {
  lang: ClarityLang;
  selected: QaFilter[];
  counts: Partial<Record<QaFilter, number>>;
  onChange: (next: QaFilter[]) => void;
  compact?: boolean;
}) {
  const t = COPY[lang];
  return (
    <div className={compact ? "mt-2" : "mt-3"}>
      <p className="mb-1.5 text-[11px] font-medium text-zinc-400">{t.filtersLabel}</p>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange([])}
          className={`inline-flex min-h-8 items-center rounded-full px-2.5 text-[11px] font-medium sm:min-h-9 sm:px-3 sm:text-[12px] ${
            selected.length === 0
              ? "bg-assis-blue text-white"
              : "border border-black/[0.08] bg-white text-zinc-600"
          }`}
        >
          {t.filterAll}
        </button>
        {QA_FILTERS.map((id) => {
          const on = selected.includes(id);
          const count = counts[id] || 0;
          return (
            <button
              key={id}
              type="button"
              onClick={() =>
                onChange(on ? selected.filter((item) => item !== id) : [...selected, id])
              }
              className={`inline-flex min-h-8 items-center rounded-full px-2.5 text-[11px] font-medium sm:min-h-9 sm:px-3 sm:text-[12px] ${
                on ? "bg-assis-blue text-white" : "border border-black/[0.08] bg-white text-zinc-600"
              }`}
            >
              {qaFilterLabel(lang, id)}
              <span className={`ms-1.5 text-[10px] ${on ? "text-white/80" : "text-zinc-400"}`}>{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
