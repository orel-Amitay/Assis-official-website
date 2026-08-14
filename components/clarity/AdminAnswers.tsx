"use client";

import { useEffect, useState } from "react";
import { COPY, type ClarityLang } from "@/lib/clarity/copy";
import type { AdminDraftAnswers } from "@/lib/clarity/admin-types";
import { knowledgeFileSlug } from "@/lib/clarity/knowledge-export";

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: "application/json;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}

export default function AdminAnswers({ lang = "he" }: { lang?: ClarityLang }) {
  const t = COPY[lang];
  const he = lang === "he";
  const [drafts, setDrafts] = useState<AdminDraftAnswers[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/clarity/admin/answers", { cache: "no-store" });
        if (response.status === 403) {
          if (!cancelled) setError(t.adminForbidden);
          return;
        }
        if (!response.ok) throw new Error("load");
        const data = (await response.json()) as { drafts?: AdminDraftAnswers[] };
        if (!cancelled) setDrafts(Array.isArray(data.drafts) ? data.drafts : []);
      } catch {
        if (!cancelled) setError(t.adminForbidden);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t.adminForbidden]);

  if (error) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-8">
        <p className="text-[15px] text-muted-foreground">{error}</p>
      </main>
    );
  }

  if (!drafts) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-8">
        <p className="text-[15px] text-muted-foreground">{he ? "טוענים…" : "Loading…"}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-8 sm:py-14">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-assis-blue">{t.product}</p>
      <h1 className="font-display mt-3 text-[1.85rem] font-bold tracking-[-0.04em] text-foreground">
        {t.adminTitle}
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{t.adminBody}</p>
      {drafts.length > 0 ? (
        <button
          type="button"
          onClick={() => downloadJson(`clarity-answers-${new Date().toISOString().slice(0, 10)}.json`, drafts)}
          className="mt-5 inline-flex h-10 items-center rounded-full bg-assis-blue px-4 text-[13px] font-semibold text-white"
        >
          {t.adminDownloadAll}
        </button>
      ) : null}

      {drafts.length === 0 ? (
        <p className="mt-8 text-[14px] text-muted-foreground">{t.adminEmpty}</p>
      ) : (
        <div className="mt-8 space-y-3">
          {drafts.map((draft) => {
            const count = draft.answers.reduce(
              (sum, category) =>
                sum + category.sections.reduce((inner, section) => inner + section.detailContent.length, 0),
              0,
            );
            return (
              <article
                key={`${draft.userId}:${draft.draftId}`}
                className="rounded-[1.3rem] border border-black/[0.05] bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-foreground">{draft.storeName}</p>
                    <p className="mt-0.5 break-all text-[12px] text-zinc-400" dir="ltr">
                      {draft.storeUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </p>
                    <p className="mt-1 text-[12px] text-zinc-500">
                      {draft.email || draft.username || draft.name || draft.userId}
                      {" · "}
                      {count} {he ? "תשובות" : "answers"}
                      {" · "}
                      {new Date(draft.savedAt).toLocaleString(he ? "he-IL" : "en-GB", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                      {draft.deleted ? ` · ${t.adminDeleted}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      downloadJson(
                        `clarity-${knowledgeFileSlug(draft.storeName)}-${draft.draftId.slice(0, 8)}.json`,
                        {
                          storeName: draft.storeName,
                          storeUrl: draft.storeUrl,
                          user: { email: draft.email, name: draft.name, username: draft.username },
                          savedAt: draft.savedAt,
                          sections: draft.answers,
                        },
                      )
                    }
                    className="shrink-0 rounded-full bg-assis-blue px-3 py-2 text-[12px] font-semibold text-white"
                  >
                    {t.adminDownloadOne}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
