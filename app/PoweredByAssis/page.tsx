import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AssisPlugin from "@/components/AssisPlugin";
import { DemoModalProvider } from "@/components/DemoModal";
import Nav from "@/components/Nav";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import {
  getPoweredByAssisItems,
  POWERED_BY_ASSIS_FOOTER,
  POWERED_BY_ASSIS_INTRO,
  POWERED_BY_ASSIS_PDF_HREF,
} from "@/lib/powered-by-assis";

export const metadata: Metadata = {
  title: "What you now have with Assis | Powered by Assis",
  description:
    "Your Powered by Assis package is live - Shopify, always-on AI, Knowledge Base, AssisWorld, operational view, and a dedicated Assis contact.",
};

function MaterialIcon({ name }: { name: string }) {
  return (
    <span
      className="material-symbols-outlined text-[22px] text-assis-blue"
      style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
      aria-hidden
    >
      {name}
    </span>
  );
}

export default function PoweredByAssisPage() {
  const items = getPoweredByAssisItems("your brand");

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

          <main className="mx-auto max-w-3xl px-5 pb-8 pt-24 sm:px-8 sm:pb-12 sm:pt-28">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-assis-blue/15 bg-white/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-assis-blue backdrop-blur-sm">
                Powered by Assis
              </span>
              <Link
                href="/#ways"
                className="text-[13px] font-semibold text-muted-foreground transition hover:text-assis-blue"
              >
                ← Packages
              </Link>
            </div>

            <div className="mt-8 flex items-start gap-4 sm:gap-5">
              <Image
                src="/brand/assis-heart.png"
                alt=""
                width={56}
                height={52}
                className="mt-1 h-12 w-auto sm:h-14"
                unoptimized
              />
              <div>
                <h1 className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
                  What you now have with{" "}
                  <span className="text-assis-blue">Assis</span>
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {POWERED_BY_ASSIS_INTRO}
                </p>
              </div>
            </div>

            <ol className="mt-12 space-y-3">
              {items.map((item, index) => (
                <li
                  key={item.title}
                  className="rounded-3xl border border-border/70 bg-white/70 p-5 sm:p-6"
                >
                  <div className="flex gap-4 sm:gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-assis-blue/10 bg-assis-blue-light">
                      <MaterialIcon name={item.icon} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-assis-blue/70">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h2 className="font-display text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
                          {item.title}
                        </h2>
                      </div>
                      <p className="mt-2 text-[15px] leading-relaxed text-zinc-600 sm:text-base">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-3xl border border-assis-blue/10 bg-assis-blue-light/50 px-6 py-7 sm:px-8 sm:py-8">
              <p className="text-[15px] leading-relaxed text-zinc-600 sm:text-base">
                {POWERED_BY_ASSIS_FOOTER}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="mailto:orel@assis.care"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-assis-blue px-5 text-sm font-semibold text-white transition hover:bg-assis-blue-deep"
                >
                  Email us
                </a>
                <a
                  href={POWERED_BY_ASSIS_PDF_HREF}
                  download
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-white/80 px-5 text-sm font-semibold text-foreground transition hover:bg-white"
                >
                  Download PDF
                </a>
                <a
                  href="https://onboarding.assis.care/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-transparent px-5 text-sm font-semibold text-assis-blue transition hover:text-assis-blue-deep"
                >
                  Open AssisWorld →
                </a>
              </div>
            </div>
          </main>

          <FinalCTA />
          <Footer />
          <AssisPlugin />
        </div>
      </div>
    </DemoModalProvider>
  );
}
