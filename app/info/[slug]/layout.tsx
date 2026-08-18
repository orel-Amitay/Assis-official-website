import { Heebo } from "next/font/google";
import type { ReactNode } from "react";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-info",
});

export default function ConsumerInfoLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${heebo.variable} min-h-full`} style={{ fontFamily: "var(--font-info), var(--font-sans), sans-serif" }}>
      {children}
    </div>
  );
}
