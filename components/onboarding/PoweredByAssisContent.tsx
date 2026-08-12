import Image from "next/image";
import Link from "next/link";
import {
  getPoweredByAssisItems,
  POWERED_BY_ASSIS_FOOTER,
  POWERED_BY_ASSIS_INTRO,
  POWERED_BY_ASSIS_PDF_HREF,
} from "@/lib/powered-by-assis";

/** Classic Assis heart (blue heart + white wordmark) — shared by site + plugin. */
export const ASSIS_HEART_SRC = "/brand/assis-heart-classic.png";

function MaterialIcon({ name, compact }: { name: string; compact?: boolean }) {
  return (
    <span
      className={`material-symbols-outlined text-assis-blue ${compact ? "text-[18px]" : "text-[22px]"}`}
      style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
      aria-hidden
    >
      {name}
    </span>
  );
}

type PoweredByAssisContentProps = {
  brandName?: string;
  /** Compact single-page layout for PDF export */
  forPrint?: boolean;
};

export default function PoweredByAssisContent({
  brandName = "your brand",
  forPrint = false,
}: PoweredByAssisContentProps) {
  const items = getPoweredByAssisItems(brandName);

  return (
    <main
      className={
        forPrint
          ? "mx-auto max-w-3xl px-6 pb-6 pt-6"
          : "mx-auto max-w-3xl px-5 pb-8 pt-24 sm:px-8 sm:pb-12 sm:pt-28"
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-assis-blue/15 bg-white/70 font-bold uppercase tracking-[0.18em] text-assis-blue backdrop-blur-sm ${
            forPrint ? "px-3 py-1 text-[10px]" : "px-3.5 py-1.5 text-[11px]"
          }`}
        >
          Powered by Assis
        </span>
        {!forPrint && (
          <Link
            href="/#ways"
            className="text-[13px] font-semibold text-muted-foreground transition hover:text-assis-blue"
          >
            ← Packages
          </Link>
        )}
      </div>

      <div
        className={`flex flex-nowrap items-center ${forPrint ? "mt-5 gap-3" : "mt-8 items-start gap-4 sm:gap-5"}`}
      >
        <Image
          src={ASSIS_HEART_SRC}
          alt="Assis"
          width={56}
          height={54}
          className={`shrink-0 ${forPrint ? "h-11 w-auto" : "mt-1 h-12 w-auto sm:h-14"}`}
          unoptimized
          priority
        />
        <div className="min-w-0">
          <h1
            className={`font-display font-bold tracking-[-0.04em] text-foreground ${
              forPrint ? "text-[1.65rem] leading-tight" : "text-4xl sm:text-5xl"
            }`}
          >
            What you now have with <span className="text-assis-blue">Assis</span>
          </h1>
          <p
            className={`max-w-xl leading-relaxed text-muted-foreground ${
              forPrint ? "mt-1.5 text-[13px]" : "mt-4 text-base sm:text-lg"
            }`}
          >
            {POWERED_BY_ASSIS_INTRO}
          </p>
        </div>
      </div>

      <ol className={forPrint ? "mt-5 space-y-2" : "mt-12 space-y-3"}>
        {items.map((item, index) => (
          <li
            key={item.title}
            className={`rounded-3xl border border-border/70 bg-white/70 ${
              forPrint ? "rounded-2xl p-3" : "p-5 sm:p-6"
            }`}
          >
            <div className={`flex ${forPrint ? "gap-3" : "gap-4 sm:gap-5"}`}>
              <div
                className={`flex shrink-0 items-center justify-center rounded-2xl border border-assis-blue/10 bg-assis-blue-light ${
                  forPrint ? "h-9 w-9 rounded-xl" : "h-11 w-11"
                }`}
              >
                <MaterialIcon name={item.icon} compact={forPrint} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span
                    className={`font-semibold uppercase tracking-[0.16em] text-assis-blue/70 ${
                      forPrint ? "text-[9px]" : "text-[11px]"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2
                    className={`font-display font-bold tracking-[-0.03em] text-foreground ${
                      forPrint ? "text-base" : "text-xl sm:text-2xl"
                    }`}
                  >
                    {item.title}
                  </h2>
                </div>
                <p
                  className={`leading-relaxed text-zinc-600 ${
                    forPrint ? "mt-1 text-[12px] leading-snug" : "mt-2 text-[15px] sm:text-base"
                  }`}
                >
                  {item.body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div
        className={`rounded-3xl border border-assis-blue/10 bg-assis-blue-light/50 ${
          forPrint ? "mt-4 rounded-2xl px-4 py-3" : "mt-10 px-6 py-7 sm:px-8 sm:py-8"
        }`}
      >
        <p
          className={`leading-relaxed text-zinc-600 ${
            forPrint ? "text-[12px] leading-snug" : "text-[15px] sm:text-base"
          }`}
        >
          {POWERED_BY_ASSIS_FOOTER}
        </p>
        {forPrint ? (
          <p className="mt-2 text-[12px] font-semibold text-assis-blue">
            assis.care · orel@assis.care
          </p>
        ) : (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="mailto:orel@assis.care"
              className="inline-flex h-11 items-center justify-center rounded-full bg-assis-blue px-5 text-sm font-semibold text-white transition hover:bg-assis-blue-deep"
            >
              Email us
            </a>
            <a
              href={POWERED_BY_ASSIS_PDF_HREF}
              download
              className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white/80 px-5 text-sm font-semibold text-foreground transition hover:bg-white"
            >
              Download PDF
            </a>
            <a
              href="https://onboarding.assis.care/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full border border-transparent px-5 text-sm font-semibold text-assis-blue transition hover:text-assis-blue-deep"
            >
              Open AssisWorld →
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
