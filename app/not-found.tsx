import Link from "next/link";
import SiteShell from "@/components/tennis-club/SiteShell";

export default function NotFound() {
  return (
    <SiteShell>
      <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-display text-3xl tracking-[0.2em]">404</h1>
        <p className="mt-4 text-sm text-muted">
          This page could not be found.
        </p>
        <Link
          href="/"
          className="mt-8 bg-foreground px-6 py-3 text-[11px] font-semibold tracking-[0.18em] text-white"
        >
          BACK TO HOME
        </Link>
      </div>
    </SiteShell>
  );
}
