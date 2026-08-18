"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { ConsumerCategory, ConsumerInfo } from "@/lib/consumer-info";

const TOKEN =
  /(https?:\/\/[^\s<]+|(?:mailto:)?[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b0\d{1,2}[-\s]?\d{3}[-\s]?\d{4}\b)/gi;

function formatDate(value: string | null, lang: ConsumerInfo["lang"]) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(lang === "he" ? "he-IL" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function RichAnswer({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  return (
    <p className="whitespace-pre-wrap text-[13.5px] leading-[1.75] text-zinc-600">
      {parts.map((part, index) => {
        if (!part) return null;
        if (/^https?:\/\//i.test(part)) {
          return (
            <a
              key={`${part}-${index}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-zinc-800 underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-800"
            >
              {part.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          );
        }
        if (/@/.test(part) && part.includes(".")) {
          const href = part.startsWith("mailto:") ? part : `mailto:${part}`;
          const label = part.replace(/^mailto:/, "");
          return (
            <a
              key={`${part}-${index}`}
              href={href}
              className="font-medium text-zinc-800 underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-800"
            >
              {label}
            </a>
          );
        }
        if (/^0\d/.test(part.replace(/[-\s]/g, ""))) {
          return (
            <a
              key={`${part}-${index}`}
              href={`tel:${part.replace(/[-\s]/g, "")}`}
              className="font-medium text-zinc-800 underline decoration-zinc-300 underline-offset-2 transition hover:decoration-zinc-800"
              dir="ltr"
            >
              {part}
            </a>
          );
        }
        return <span key={`${part}-${index}`}>{part}</span>;
      })}
    </p>
  );
}

function filterCategories(categories: ConsumerCategory[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return categories;
  return categories
    .map((category) => ({
      ...category,
      topics: category.topics
        .map((topic) => ({
          ...topic,
          items: topic.items.filter(
            (item) =>
              category.name.toLowerCase().includes(needle) ||
              topic.name.toLowerCase().includes(needle) ||
              item.question.toLowerCase().includes(needle) ||
              item.answer.toLowerCase().includes(needle),
          ),
        }))
        .filter((topic) => topic.items.length > 0),
    }))
    .filter((category) => category.topics.length > 0);
}

export default function ConsumerInfoView({ info }: { info: ConsumerInfo }) {
  const he = info.lang !== "en";
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(info.categories[0]?.id || "");
  const searching = query.trim().length > 0;
  const matches = useMemo(() => filterCategories(info.categories, query), [info.categories, query]);
  const visible = searching ? matches : info.categories.filter((category) => category.id === activeId);
  const updated = formatDate(info.savedAt, info.lang);

  return (
    <div
      className="relative isolate min-h-full bg-white"
      dir={he ? "rtl" : "ltr"}
      lang={he ? "he" : "en"}
    >
      <div className="relative">
        <header
          className="sticky top-0 z-40 border-b border-black/[0.05] bg-white/90 backdrop-blur-md"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <div className="mx-auto flex max-w-[680px] items-center justify-between px-5 py-4">
            <div className="flex min-w-0 items-center gap-4">
              {info.logo ? (
                <img
                  src={info.logo}
                  alt={info.storeName}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-[12px] object-cover shadow-[0_1px_2px_rgba(0,0,0,0.12)]"
                />
              ) : null}
              <div className="min-w-0">
                <h1 className="text-[15px] font-semibold leading-snug tracking-[-0.02em] text-zinc-900">
                  {he ? "מידע ללקוחות" : "Customer information"}
                </h1>
                <p className="mt-1.5 truncate text-[12px] leading-snug text-zinc-400">{info.storeName}</p>
              </div>
            </div>
            <p className="font-display shrink-0 text-[15px] font-bold tracking-[-0.04em] text-assis-blue">Assis</p>
          </div>
        </header>

        <main className="mx-auto max-w-[680px] px-5 pb-16 pt-6">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 size-3.5 -translate-y-1/2 text-zinc-400" style={{ insetInlineStart: 14 }} />
            <span className="sr-only">{he ? "חיפוש" : "Search"}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={he ? "חיפוש — משלוחים, החזרות, תשלום…" : "Search shipping, returns, payment…"}
              className="h-11 w-full rounded-2xl border border-black/[0.05] bg-white text-[13.5px] text-foreground outline-none transition placeholder:text-zinc-400 focus:border-black/10 focus:ring-4 focus:ring-black/[0.03]"
              style={{ paddingInlineStart: 38, paddingInlineEnd: 16 }}
            />
          </label>

          {!searching && info.categories.length > 0 ? (
            <nav aria-label={he ? "נושאים" : "Topics"} className="mt-5">
              <div className="flex gap-5 overflow-x-auto border-b border-black/[0.06] no-scrollbar">
                {info.categories.map((category) => {
                  const active = category.id === activeId;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveId(category.id)}
                      className={`relative shrink-0 pb-2.5 text-[13px] transition ${
                        active ? "font-medium text-zinc-900" : "text-zinc-400 hover:text-zinc-700"
                      }`}
                    >
                      {category.name}
                      {active ? (
                        <span className="absolute inset-x-0 -bottom-px h-[1.5px] rounded-full bg-zinc-900" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </nav>
          ) : null}

          {visible.length === 0 ? (
            <p className="mt-10 text-center text-[13.5px] text-zinc-500">
              {he ? "לא מצאנו מידע שמתאים לחיפוש." : "No matching information."}
            </p>
          ) : (
            <div className="mt-5 space-y-8">
              {visible.map((category) => (
                <section key={category.id}>
                  {searching ? (
                    <h2 className="mb-3 text-[12px] font-medium text-zinc-400">{category.name}</h2>
                  ) : null}
                  <div className="space-y-2">
                    {category.topics.map((topic) => (
                      <article
                        key={`${category.id}-${topic.name}`}
                        className="rounded-2xl border border-black/[0.04] bg-white px-4 py-4 sm:px-[1.15rem] sm:py-[1.05rem]"
                      >
                        <h3 className="text-[14px] font-semibold tracking-[-0.02em] text-zinc-900">
                          {topic.name}
                        </h3>
                        <div className="mt-2.5 space-y-3">
                          {topic.items.map((item, index) => (
                            <div
                              key={`${topic.name}-${index}`}
                              className={index === 0 ? "" : "border-t border-black/[0.04] pt-3"}
                            >
                              {item.question ? (
                                <p className="mb-1 text-[13px] font-medium leading-snug text-zinc-800">
                                  {item.question}
                                </p>
                              ) : null}
                              <RichAnswer text={item.answer} />
                            </div>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {updated ? (
            <p className="mt-8 text-center text-[11px] text-zinc-400">
              {he ? `עודכן ${updated}` : `Updated ${updated}`}
            </p>
          ) : null}
        </main>

        <footer className="px-5 pb-10 pt-2 text-center">
          <p className="font-display text-[13px] font-bold tracking-[-0.04em] text-assis-blue">Assis</p>
        </footer>
      </div>
    </div>
  );
}
