import Link from "next/link";
import AssisPlugin from "@/components/AssisPlugin";
import { DemoModalProvider } from "@/components/DemoModal";
import Nav from "@/components/Nav";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import { LEGAL_DOCS, LEGAL_LAST_UPDATED, legalDoc, type LegalSlug } from "@/lib/legal";

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-foreground">{children}</h3>
  );
}

export function Bullet({ children }: { children: React.ReactNode }) {
  return <li className="pl-1">{children}</li>;
}

export function List({
  children,
  spacing = "tight",
}: {
  children: React.ReactNode;
  spacing?: "tight" | "loose";
}) {
  return (
    <ul className={`list-disc pl-5 ${spacing === "loose" ? "space-y-3" : "space-y-2"}`}>
      {children}
    </ul>
  );
}

export function Term({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-foreground">{children}</span>;
}

export function Mail({ address = "accountant@assis.care" }: { address?: string }) {
  return (
    <a
      href={`mailto:${address}`}
      className="font-semibold text-assis-blue transition hover:text-assis-blue-deep"
    >
      {address}
    </a>
  );
}

/** Cross-reference to another Assis legal document. */
export function DocLink({ slug, label }: { slug: LegalSlug; label?: string }) {
  const doc = legalDoc(slug);
  return (
    <Link
      href={doc.href}
      className="font-semibold text-assis-blue transition hover:text-assis-blue-deep"
    >
      {label ?? `Assis ${doc.title}`}
    </Link>
  );
}

export function ContactCard() {
  return (
    <address className="not-italic rounded-2xl border border-[#dfe3f5] bg-[#eef0fa] px-6 py-7 sm:px-8 sm:py-8">
      <div className="space-y-5 text-[15px] leading-relaxed text-zinc-600 sm:text-base">
        <div className="space-y-1">
          <p className="font-semibold text-foreground">Assis Online Inc.</p>
          <p>
            28 Geary St STE 650, 585
            <br />
            San Francisco, CA 94108
            <br />
            United States
          </p>
        </div>
        <div className="space-y-2">
          <p>
            <Term>Email:</Term>{" "}
            <a
              href="mailto:accountant@assis.care"
              className="text-assis-blue transition hover:text-assis-blue-deep"
            >
              accountant@assis.care
            </a>
          </p>
          <p>
            <Term>Website:</Term>{" "}
            <a
              href="https://assis.care"
              className="text-assis-blue transition hover:text-assis-blue-deep"
            >
              https://assis.care
            </a>
          </p>
        </div>
      </div>
    </address>
  );
}

function RelatedDocs({ current }: { current: LegalSlug }) {
  const others = LEGAL_DOCS.filter((doc) => doc.slug !== current);

  return (
    <nav aria-label="Other Assis legal documents" className="mt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        Related documents
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {others.map((doc) => (
          <li key={doc.slug}>
            <Link
              href={doc.href}
              className="inline-flex rounded-full border border-[#dfe3f5] bg-white px-3.5 py-1.5 text-[13px] font-medium text-zinc-600 transition hover:border-assis-blue/40 hover:text-assis-blue"
            >
              {doc.shortLabel}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function LegalPage({ slug, children }: { slug: LegalSlug; children: React.ReactNode }) {
  const doc = legalDoc(slug);

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

        <div className="relative">
          <Nav />

          <main className="mx-auto max-w-3xl px-5 pb-8 pt-24 sm:px-8 sm:pb-12 sm:pt-28">
            <h1 className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
              {doc.title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Last Updated: {LEGAL_LAST_UPDATED}
            </p>

            <RelatedDocs current={slug} />

            <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-zinc-600 sm:text-base">
              {children}

              <p className="text-sm text-muted-foreground">
                © 2026 Assis Online Inc. All rights reserved.
              </p>
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

export function legalMetadata(slug: LegalSlug) {
  const doc = legalDoc(slug);
  return {
    title: `${doc.title} | Assis`,
    description: doc.description,
  };
}
