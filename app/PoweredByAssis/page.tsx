import type { Metadata } from "next";
import AssisPlugin from "@/components/AssisPlugin";
import { DemoModalProvider } from "@/components/DemoModal";
import PoweredByAssisContent from "@/components/onboarding/PoweredByAssisContent";
import Nav from "@/components/Nav";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "What you now have with Assis | Powered by Assis",
  description:
    "Your Powered by Assis package is live - Shopify, always-on AI, Knowledge Base, AssisWorld, operational view, and a dedicated Assis contact.",
};

export default function PoweredByAssisPage() {
  return (
    <DemoModalProvider>
      <div className="relative isolate min-h-full overflow-x-clip bg-[#f7f8fa]">
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
          <Nav />
          <PoweredByAssisContent />
          <FinalCTA />
          <Footer />
          <AssisPlugin />
        </div>
      </div>
    </DemoModalProvider>
  );
}
