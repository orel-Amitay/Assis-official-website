import { DemoModalProvider } from "@/components/DemoModal";
import WhatsAppHeart from "@/components/WhatsAppHeart";
import Nav from "@/components/Nav";
import SectionBand from "@/components/SectionBand";
import Hero from "@/components/sections/Hero";
import Metrics from "@/components/sections/Metrics";
import Journey from "@/components/sections/Journey";
import CustomerStories from "@/components/sections/CustomerStories";
import Platforms from "@/components/sections/Platforms";
import Relationship from "@/components/sections/Relationship";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <DemoModalProvider>
      <div className="relative isolate overflow-x-clip bg-[#f7f8fa]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(9,9,11,0.035) 1px, transparent 0)`,
            backgroundSize: "22px 22px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[55vh]"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 50% 0%, rgba(29,111,238,0.1), transparent 70%)",
          }}
        />

        <div className="relative">
          <Nav />
          <SectionBand tone="soft">
            <Hero />
            <Metrics />
          </SectionBand>
          <SectionBand tone="cool">
            <CustomerStories />
          </SectionBand>
          <SectionBand tone="slate">
            <Journey />
          </SectionBand>
          <SectionBand tone="mist">
            <Platforms />
          </SectionBand>
          <SectionBand tone="paper">
            <Relationship />
          </SectionBand>
          <SectionBand tone="soft">
            <FAQ />
          </SectionBand>
          <SectionBand tone="cool">
            <FinalCTA />
            <Footer />
          </SectionBand>
          <WhatsAppHeart />
        </div>
      </div>
    </DemoModalProvider>
  );
}
