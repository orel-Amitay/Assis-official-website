import type { ClarityLang } from "./copy";
import { knowledgeJson, knowledgeJsonText } from "./review-state";
import type { ReviewState, ScanResult } from "./types";

export function knowledgeFileSlug(storeName: string) {
  return (
    storeName
      .replace(/\s+/g, "-")
      .replace(/[^\w\u0590-\u05ff-]+/g, "")
      .toLowerCase()
      .replace(/^-+|-+$/g, "") || "store"
  );
}

export function knowledgeFileStamp() {
  return new Date().toISOString().slice(0, 10);
}

export function knowledgePlainText(result: ScanResult, state: ReviewState, lang: ClarityLang = "he") {
  const he = lang === "he";
  const categories = knowledgeJson(result, state, lang);
  const qLabel = he ? "שאלה" : "Question";
  const aLabel = he ? "תשובה" : "Answer";
  const review = he ? "לסקירה" : "Needs review";
  const lines = [`${result.storeName}`, result.storeUrl, ""];

  for (const category of categories) {
    lines.push(`# ${category.name}`, "");
    for (const section of category.sections) {
      lines.push(`## ${section.detailName}${section.needsReview ? ` (${review})` : ""}`);
      for (const item of section.detailContent) {
        if (item.question) lines.push(`${qLabel}: ${item.question}`);
        lines.push(`${aLabel}: ${item.answer}`);
        if (item.approval === "pending") lines.push(`(${review})`);
        lines.push("");
      }
    }
  }

  if (categories.length === 0) {
    lines.push(he ? "אין עדיין שאלות ותשובות לייצוא." : "No Q&A to export yet.");
  }

  return `${lines.join("\n").trim()}\n`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function knowledgePrintHtml(result: ScanResult, state: ReviewState, lang: ClarityLang = "he") {
  const he = lang === "he";
  const categories = knowledgeJson(result, state, lang);
  const title = he ? `מאגר ידע — ${result.storeName}` : `Knowledge base — ${result.storeName}`;
  const parts: string[] = [];

  for (const category of categories) {
    parts.push(`<section class="cat"><h2>${escapeHtml(category.name)}</h2>`);
    for (const section of category.sections) {
      parts.push(`<article class="topic">`);
      parts.push(
        `<h3>${escapeHtml(section.detailName)}${section.needsReview ? ` <span class="badge">${he ? "לסקירה" : "Review"}</span>` : ""}</h3>`,
      );
      for (const item of section.detailContent) {
        parts.push(`<div class="qa">`);
        if (item.question) parts.push(`<p class="q">${escapeHtml(item.question)}</p>`);
        parts.push(`<p class="a">${escapeHtml(item.answer).replace(/\n/g, "<br>")}</p>`);
        parts.push(`</div>`);
      }
      parts.push(`</article>`);
    }
    parts.push(`</section>`);
  }

  return `<!DOCTYPE html>
<html lang="${he ? "he" : "en"}" dir="${he ? "rtl" : "ltr"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root { --text:#18181b; --muted:#52525b; --line:#ececee; --blue:#1d6fee; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Heebo, sans-serif; color: var(--text); background: #fff; }
    .bar { position: sticky; top: 0; display: flex; gap: 8px; justify-content: center; padding: 12px 16px; background: #f7f8fa; border-bottom: 1px solid var(--line); }
    .bar button { font: inherit; border: 0; border-radius: 999px; padding: 10px 16px; background: #1d6fee; color: #fff; font-weight: 600; cursor: pointer; }
    main { max-width: 760px; margin: 0 auto; padding: 28px 20px 64px; }
    h1 { font-size: 1.7rem; letter-spacing: -0.04em; margin: 0 0 6px; }
    .meta { margin: 0 0 24px; color: var(--muted); font-size: 13px; }
    .cat { margin: 0 0 28px; }
    .cat h2 { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--blue); margin: 0 0 12px; }
    .topic { border: 1px solid var(--line); border-radius: 18px; padding: 8px 18px 12px; margin: 0 0 12px; break-inside: avoid; }
    .topic h3 { font-size: 1.05rem; margin: 12px 0 4px; }
    .badge { font-size: 11px; font-weight: 600; color: #b45309; }
    .qa { padding: 12px 0; border-top: 1px solid var(--line); }
    .topic .qa:first-of-type { border-top: 0; }
    .q { margin: 0 0 6px; font-weight: 600; line-height: 1.45; }
    .a { margin: 0; line-height: 1.7; color: #3f3f46; white-space: pre-wrap; }
    @media print {
      .bar { display: none !important; }
      .topic { break-inside: avoid; }
      @page { margin: 14mm; }
    }
  </style>
</head>
<body>
  <div class="bar">
    <button type="button" onclick="window.print()">${he ? "הדפסה / שמירה כ-PDF" : "Print / Save as PDF"}</button>
  </div>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p class="meta" dir="ltr">${escapeHtml(result.storeUrl)}</p>
    ${parts.join("\n") || `<p>${he ? "אין עדיין שאלות ותשובות." : "No Q&A yet."}</p>`}
  </main>
  <script>window.addEventListener("load", function () { setTimeout(function () { window.print(); }, 300); });</script>
</body>
</html>`;
}

export function downloadKnowledgeFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}

export function downloadKnowledgeJson(result: ScanResult, state: ReviewState, lang: ClarityLang) {
  const slug = knowledgeFileSlug(result.storeName);
  downloadKnowledgeFile(
    knowledgeJsonText(result, state, lang),
    `knowledge-base-${slug}-${knowledgeFileStamp()}.json`,
    "application/json",
  );
}

export function downloadKnowledgeTxt(result: ScanResult, state: ReviewState, lang: ClarityLang) {
  const slug = knowledgeFileSlug(result.storeName);
  downloadKnowledgeFile(
    knowledgePlainText(result, state, lang),
    `knowledge-base-${slug}-${knowledgeFileStamp()}.txt`,
    "text/plain",
  );
}

export function downloadKnowledgePdf(result: ScanResult, state: ReviewState, lang: ClarityLang) {
  const html = knowledgePrintHtml(result, state, lang);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const popup = window.open(href, "_blank");
  if (!popup) {
    downloadKnowledgeFile(html, `knowledge-base-${knowledgeFileSlug(result.storeName)}-${knowledgeFileStamp()}.html`, "text/html");
  }
  window.setTimeout(() => URL.revokeObjectURL(href), 60_000);
}
