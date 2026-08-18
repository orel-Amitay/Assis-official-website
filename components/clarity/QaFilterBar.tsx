"use client";

import { useEffect, useRef, useState } from "react";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import {
  QA_FILTERS,
  qaFilterLabel,
  type QaFilter,
} from "@/lib/clarity/qa-filters";
import MaterialIcon from "./MaterialIcon";

export default function QaFilterBar({
  lang,
  selected,
  counts,
  onChange,
}: {
  lang: ClarityLang;
  selected: QaFilter[];
  counts: Partial<Record<QaFilter, number>>;
  onChange: (next: QaFilter[]) => void;
  compact?: boolean;
}) {
  const t = COPY[lang];
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = selected.length > 0;

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent | TouchEvent) {
      const node = rootRef.current;
      if (!node || !(event.target instanceof Node) || node.contains(event.target)) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex min-h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold transition sm:min-h-9 sm:px-3 sm:text-[12px] ${
          active || open
            ? "bg-assis-blue text-white"
            : "border border-black/[0.08] bg-white text-zinc-600 hover:text-foreground"
        }`}
      >
        <MaterialIcon name="filter_list" className="text-[16px]" />
        {t.filtersLabel}
        {active ? <span className="ms-0.5 tabular-nums">{selected.length}</span> : null}
      </button>
      {open ? (
        <div
          role="listbox"
          aria-multiselectable
          className="absolute end-0 z-50 mt-2 w-[min(18.5rem,calc(100vw-2rem))] rounded-[1.15rem] border border-black/[0.08] bg-white p-2 shadow-[0_12px_40px_-18px_rgba(16,24,40,0.35)]"
        >
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
      ) : null}
    </div>
  );
}
