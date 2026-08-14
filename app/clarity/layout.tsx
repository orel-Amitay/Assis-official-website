import { Heebo } from "next/font/google";
import type { ReactNode } from "react";
import ClarityProviders from "@/components/clarity/ClarityProviders";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-clarity",
});

export default function ClarityLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${heebo.variable} min-h-full`}>
      <ClarityProviders>{children}</ClarityProviders>
    </div>
  );
}
