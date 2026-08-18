import { Heebo } from "next/font/google";
import type { ReactNode } from "react";
import ClarityProviders from "@/components/clarity/ClarityProviders";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-clarity",
  display: "swap",
});

export default function ClarityLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${heebo.variable} min-h-full`}>
      <ClarityProviders>{children}</ClarityProviders>
    </div>
  );
}
