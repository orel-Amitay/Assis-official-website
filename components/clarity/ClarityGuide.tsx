"use client";

import { useEffect, useState } from "react";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import MaterialIcon from "./MaterialIcon";

const KEY = "clarity-guide-seen";

export function useClarityGuide(autoOpen = true) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!autoOpen) return;
    try {
      if (!window.localStorage.getItem(KEY)) setOpen(true);
    } catch {
      /* ignore */
    }
  }, [autoOpen]);

  function close() {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  return { open, close, show: () => setOpen(true) };
}

export function ClarityHelpButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-white text-zinc-500 transition hover:text-foreground"
      aria-label={label}
    >
      <MaterialIcon name="help" className="text-[18px]" />
    </button>
  );
}

export default function ClarityGuide({
  lang,
  open,
  onClose,
}: {
  lang: ClarityLang;
  open: boolean;
  onClose: () => void;
}) {
  const t = COPY[lang];
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-zinc-900/25 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-[1.5rem] border border-white/70 bg-white px-5 py-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_24px_60px_-28px_rgba(16,24,40,0.35)] sm:rounded-[1.5rem] sm:px-6 sm:pb-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-assis-blue">{t.product}</p>
        <h2 className="font-display mt-2 text-[1.35rem] font-semibold tracking-[-0.04em] text-foreground">
          {t.guideTitle}
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">{t.guideBody}</p>
        <ol className="mt-5 space-y-3">
          {t.guideSteps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-[14px] leading-relaxed text-foreground">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-assis-blue-light text-[12px] font-semibold text-assis-blue-deep">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-assis-blue text-[14px] font-semibold text-white transition hover:bg-assis-blue-deep"
        >
          {t.guideGotIt}
        </button>
      </div>
    </div>
  );
}
