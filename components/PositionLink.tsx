"use client";

import AssisHeartMark from "@/components/AssisHeartMark";

type PositionLinkProps = {
  size?: "sm" | "md" | "lg";
  showAssis?: boolean;
  className?: string;
  variant?: "default" | "dark" | "on-blue";
};

export default function PositionLink({
  size = "md",
  showAssis = true,
  className = "",
  variant = "default",
}: PositionLinkProps) {
  const label =
    size === "lg"
      ? "text-xs sm:text-sm"
      : size === "sm"
        ? "text-[9px] sm:text-[10px]"
        : "text-[10px] sm:text-[11px]";

  const heartSize = size === "lg" ? 48 : size === "sm" ? 28 : 40;

  const muted =
    variant === "dark"
      ? "text-zinc-500"
      : variant === "on-blue"
        ? "text-white/60"
        : "text-muted-foreground";
  const line =
    variant === "dark"
      ? "bg-white/15"
      : variant === "on-blue"
        ? "bg-white/30"
        : "bg-border";

  return (
    <div className={`flex w-full max-w-md items-center gap-2 sm:gap-3 ${className}`}>
      <span className={`shrink-0 font-bold uppercase tracking-[0.18em] ${label} ${muted}`}>
        Brand
      </span>
      <span className={`h-px flex-1 ${line}`} />
      {showAssis ? (
        <AssisHeartMark size={heartSize} />
      ) : (
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed text-sm font-bold ${muted} ${
            variant === "dark"
              ? "border-white/25"
              : variant === "on-blue"
                ? "border-white/40"
                : "border-border"
          }`}
        >
          ?
        </span>
      )}
      <span className={`h-px flex-1 ${line}`} />
      <span className={`shrink-0 font-bold uppercase tracking-[0.18em] ${label} ${muted}`}>
        Customer
      </span>
    </div>
  );
}
