import type { Metadata } from "next";
import { Suspense } from "react";
import ClarityApp from "@/components/clarity/ClarityApp";

export const metadata: Metadata = {
  title: "Clarity | One clean page for your store",
  description:
    "Scan an e-commerce site, confirm what’s true, and replace scattered policies with one customer page.",
  robots: { index: false, follow: false },
};

export default function ClarityPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-[#f7f8fa] text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <ClarityApp />
    </Suspense>
  );
}
