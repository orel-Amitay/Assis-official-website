import type { Metadata } from "next";
import PoweredByAssisContent from "@/components/onboarding/PoweredByAssisContent";

export const metadata: Metadata = {
  title: "What you now have with Assis | PDF",
  robots: { index: false, follow: false },
};

/** Printable twin of /PoweredByAssis — used to generate the downloadable PDF 1:1. */
export default function PoweredByAssisPrintPage() {
  return (
    <div
      data-print-page
      className="relative isolate overflow-x-clip bg-[#f7f8fa] text-foreground antialiased"
    >
      <style>{`
        @page {
          size: A4;
          margin: 6mm;
        }
        html:has([data-print-page]),
        body:has([data-print-page]) {
          height: auto !important;
          min-height: 0 !important;
          overflow: visible !important;
          background: #f7f8fa !important;
        }
        html:has([data-print-page]) #app-scroll {
          height: auto !important;
          min-height: 0 !important;
          overflow: visible !important;
          background: #f7f8fa !important;
        }
      `}</style>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(9,9,11,0.035) 1px, transparent 0)`,
          backgroundSize: "22px 22px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[50vh]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 0%, rgba(29,111,238,0.1), transparent 70%)",
        }}
      />
      <div className="relative">
        <PoweredByAssisContent forPrint />
      </div>
    </div>
  );
}
