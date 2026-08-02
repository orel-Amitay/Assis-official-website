import type { ReactNode } from "react";

const TONES = {
  soft: {
    className: "bg-gradient-to-b from-transparent via-[#f4f6f9] to-transparent",
    fade: "#f4f6f9",
  },
  cool: {
    className: "bg-gradient-to-b from-transparent via-[#e8eef7] to-transparent",
    fade: "#e8eef7",
  },
  paper: {
    className: "bg-gradient-to-b from-transparent via-white to-transparent",
    fade: "#ffffff",
  },
  mist: {
    className: "bg-gradient-to-b from-transparent via-[#e4ebf6] to-transparent",
    fade: "#e4ebf6",
  },
  slate: {
    className: "bg-gradient-to-b from-transparent via-[#eef1f5] to-transparent",
    fade: "#eef1f5",
  },
} as const;

export type SectionTone = keyof typeof TONES;

export function sectionFade(tone: SectionTone) {
  return TONES[tone].fade;
}

export default function SectionBand({
  tone,
  children,
  className = "",
}: {
  tone: SectionTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${TONES[tone].className} ${className}`}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f7f8fa] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f8fa] to-transparent"
        aria-hidden
      />
      <div className="relative">{children}</div>
    </div>
  );
}
