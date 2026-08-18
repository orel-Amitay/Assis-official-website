"use client";

import Image from "next/image";
import { type ReactNode } from "react";
import { signOut, useSession } from "next-auth/react";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import { clearLocalClarityData } from "@/lib/clarity/draft";

const HEART = "/brand/assis-heart-classic.png";

export default function ClarityShell({
  lang,
  onToggleLang,
  children,
}: {
  lang: ClarityLang;
  onToggleLang: () => void;
  children: ReactNode;
}) {
  const t = COPY[lang];
  const rtl = lang === "he";

  return (
    <div
      dir={rtl ? "rtl" : "ltr"}
      lang={lang === "he" ? "he" : "en"}
      className="relative isolate min-h-[100dvh] bg-[#f7f8fa]"
      style={{ fontFamily: "var(--font-clarity), var(--font-manrope), sans-serif" }}
    >
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

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 pt-3 sm:px-8 sm:pt-8">
        <div className="flex min-w-0 items-center gap-2">
          <Image
            src={HEART}
            alt=""
            width={28}
            height={27}
            className="h-6 w-auto sm:h-7"
            unoptimized
            priority
          />
          <span className="font-display truncate text-[15px] font-bold tracking-[-0.03em] text-foreground">
            {t.product}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ClarityAccount lang={lang} />
          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex h-8 items-center rounded-full border border-border bg-white/80 px-2.5 text-[11px] font-semibold text-muted-foreground transition hover:text-foreground sm:h-8 sm:px-3 sm:text-[12px]"
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      <div className="relative z-10">{children}</div>
    </div>
  );
}

function ClarityAccount({ lang }: { lang: ClarityLang }) {
  const t = COPY[lang];
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <span className="h-8 w-24 rounded-full bg-white/60" />;
  }
  if (!session?.user?.id) {
    return null;
  }
  return (
    <div className="flex items-center gap-1.5">
      {session.user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={session.user.image}
          alt=""
          className="hidden h-7 w-7 rounded-full border border-black/[0.06] object-cover sm:block"
        />
      ) : null}
      <span className="hidden max-w-[9rem] truncate text-[12px] font-medium text-foreground sm:inline">
        {session.user.name || session.user.email}
      </span>
      <button
        type="button"
        onClick={() => {
          clearLocalClarityData();
          void signOut({ callbackUrl: "/clarity" });
        }}
        className="inline-flex h-8 items-center rounded-full px-2 text-[12px] font-medium text-zinc-500 transition hover:text-foreground sm:px-1"
      >
        {t.signOut}
      </button>
    </div>
  );
}
