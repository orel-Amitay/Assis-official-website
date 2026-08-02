"use client";

import { DemoModalProvider } from "@/components/DemoModal";
import Comparison from "./Comparison";
import FAQ from "./FAQ";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";
import Hero from "./Hero";
import Nav from "./Nav";
import Packages from "./Packages";
import Platforms from "./Platforms";
import Results from "./Results";
import Scenarios from "./Scenarios";
import Testimonials from "./Testimonials";
import WhatsAppFab from "./WhatsAppFab";

export default function HomePage() {
  return (
    <DemoModalProvider>
      <div className="relative min-h-full bg-[hsl(230_100%_98%)] pt-16 md:pt-20">
        <Nav />
        <main>
          {/* 1. Value + live interactions + KPIs in first viewport */}
          <Hero />
          {/* 2. Proof numbers + store story image */}
          <Results />
          {/* 3. Three ways to work with Assis (replaces generic How it Works) */}
          <Packages />
          {/* 4. Without vs With — clear for SME owners */}
          <Comparison />
          {/* 5. Platforms constellation */}
          <Platforms />
          {/* 6. Real scenarios — non-generic product moments */}
          <Scenarios />
          {/* 7. Merchant photos + quotes */}
          <Testimonials />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
        <WhatsAppFab />
      </div>
    </DemoModalProvider>
  );
}
