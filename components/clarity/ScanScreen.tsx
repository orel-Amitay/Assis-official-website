"use client";

import Image from "next/image";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";

const HEART = "/brand/assis-heart-classic.png";

export default function ScanScreen({
  lang,
  stepIndex,
  storeLabel,
}: {
  lang: ClarityLang;
  stepIndex: number;
  storeLabel: string;
}) {
  const t = COPY[lang];

  return (
    <main className="mx-auto max-w-xl px-4 pb-16 pt-8 sm:px-8 sm:pt-16">
      <div
        className="mx-auto flex flex-col items-center text-center"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32">
          <span
            className="animate-clarity-scan-ring absolute inset-0 rounded-full border-[3px] border-assis-blue/15 border-t-assis-blue"
            aria-hidden
          />
          <span
            className="absolute inset-4 rounded-full bg-assis-blue/20 blur-xl"
            aria-hidden
          />
          <Image
            src={HEART}
            alt=""
            width={72}
            height={70}
            unoptimized
            priority
            className="animate-clarity-heartbeat relative h-14 w-auto drop-shadow-[0_8px_24px_rgba(29,111,238,0.35)] sm:h-16"
          />
        </div>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-assis-blue">
          {t.product}
        </p>
        <h1 className="font-display mt-3 text-[1.75rem] font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
          {t.scanningTitle}
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">{t.scanningBody}</p>
        {storeLabel ? (
          <p className="mt-2 text-sm font-semibold text-foreground">
            <span dir="ltr" className="inline-block">
              {storeLabel}
            </span>
          </p>
        ) : null}
      </div>

      <ol className="mt-8 space-y-2">
        {t.scanSteps.map((step, i) => {
          const done = i < stepIndex;
          const current = i === stepIndex;
          return (
            <li
              key={step}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                current
                  ? "border-assis-blue/20 bg-assis-blue-light/80 font-semibold text-assis-blue-deep"
                  : done
                    ? "border-border/70 bg-white/80 text-foreground"
                    : "border-transparent bg-white/40 text-muted-foreground"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center ${
                  current ? "text-assis-blue" : done ? "text-assis-blue/70" : "text-zinc-300"
                }`}
                aria-hidden
              >
                {current ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-assis-blue/25 border-t-assis-blue" />
                ) : done ? (
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                    <path
                      d="M3.5 8.5 6.5 11.5 12.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-current" />
                )}
              </span>
              {step}
            </li>
          );
        })}
      </ol>
    </main>
  );
}
