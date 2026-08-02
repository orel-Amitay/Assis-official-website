"use client";

export type TickerItem = {
  label: string;
  iconSrc?: string;
};

function Mark({ src, label }: { src: string; label: string }) {
  return (
    <span
      role="img"
      aria-label={label}
      className="inline-block h-4 w-4 shrink-0 bg-current sm:h-5 sm:w-5"
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

const SPEED = {
  slow: { forward: "animate-marquee-slow", reverse: "animate-marquee-reverse-slow" },
  normal: { forward: "animate-marquee", reverse: "animate-marquee-reverse" },
  fast: { forward: "animate-marquee-fast", reverse: "animate-marquee-reverse-fast" },
} as const;

export default function Ticker({
  items,
  reverse = false,
  tone = "light",
  speed = "normal",
  className = "",
  fadeColor,
}: {
  items: readonly TickerItem[];
  reverse?: boolean;
  tone?: "light" | "dark" | "zinc";
  speed?: "slow" | "normal" | "fast";
  className?: string;
  fadeColor?: string;
}) {
  const loop = [...items, ...items, ...items];
  const animClass = reverse ? SPEED[speed].reverse : SPEED[speed].forward;

  const color =
    tone === "dark"
      ? "text-white/35 hover:text-white/70"
      : tone === "zinc"
        ? "text-zinc-400/80 hover:text-zinc-600"
        : "text-zinc-400 hover:text-zinc-700";

  const fade =
    fadeColor ??
    (tone === "dark" ? "#07152c" : tone === "zinc" ? "#fafafa" : "#ffffff");

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-16"
        style={{ background: `linear-gradient(to right, ${fade}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-16"
        style={{ background: `linear-gradient(to left, ${fade}, transparent)` }}
      />
      <div className={`flex w-max gap-8 py-1 sm:gap-10 ${animClass}`} aria-hidden>
        {loop.map((item, i) => (
          <div
            key={`${item.label}-${i}`}
            className={`flex items-center gap-2.5 transition-colors duration-300 ${color}`}
          >
            {item.iconSrc ? <Mark src={item.iconSrc} label={item.label} /> : null}
            <span className="font-display whitespace-nowrap text-sm font-semibold tracking-[-0.02em] sm:text-[15px]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
