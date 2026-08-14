import type { ClarityLang } from "./copy";
import { approvedFacts, knowledgeJson } from "./review-state";
import type { ReviewState, ScanResult } from "./types";

export const SUGGESTED_PAGE_PATH = "/pages/info";

const POLICY_PAGE =
  /\/policies\/|\/pages\/[^/]*(shipping|return|refund|faq|contact|warranty|pickup|terms|תקנון|משלוח|החזר|ביטול)|\/(shipping|returns?|refund|faq|warranty|contact|תקנון|משלוחים|החזרות|ביטולי-עסקאות)(\/|$)/i;

export function approvedPageCategories(result: ScanResult, state: ReviewState, lang: ClarityLang) {
  return knowledgeJson(result, state, lang)
    .map((category) => ({
      ...category,
      sections: category.sections
        .map((section) => ({
          ...section,
          detailContent: section.detailContent.filter(
            (item) => item.approval === "approved" && item.availableForCustomers,
          ),
        }))
        .filter((section) => section.detailContent.length > 0),
    }))
    .filter((category) => category.sections.length > 0);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function sitePageInnerHtml(result: ScanResult, state: ReviewState, lang: ClarityLang) {
  const he = lang === "he";
  const categories = approvedPageCategories(result, state, lang);
  const title = he ? "מידע ללקוחות" : "Customer information";
  const intro = he
    ? `כל מה שצריך לדעת על ${escapeHtml(result.storeName)} — במקום אחד.`
    : `Everything you need to know about ${escapeHtml(result.storeName)} — in one place.`;

  const parts = [`<h1>${escapeHtml(title)}</h1>`, `<p class="intro">${intro}</p>`];

  for (const category of categories) {
    parts.push(`<section class="cat">`);
    parts.push(`<h2>${escapeHtml(category.name)}</h2>`);
    for (const section of category.sections) {
      parts.push(`<article class="topic">`);
      parts.push(`<h3>${escapeHtml(section.detailName)}</h3>`);
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

  return parts.join("\n");
}

export function sitePageDocument(result: ScanResult, state: ReviewState, lang: ClarityLang) {
  const he = lang === "he";
  const inner = sitePageInnerHtml(result, state, lang);
  return `<!DOCTYPE html>
<html lang="${he ? "he" : "en"}" dir="${he ? "rtl" : "ltr"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${he ? "מידע ללקוחות" : "Customer information"} — ${escapeHtml(result.storeName)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    :root { --text:#18181b; --muted:#52525b; --line:#ececee; --blue:#1d6fee; --bg:#f7f8fa; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Heebo, sans-serif; background: var(--bg); color: var(--text); }
    main { max-width: 760px; margin: 0 auto; padding: 48px 20px 80px; }
    h1 { font-size: 2rem; letter-spacing: -0.04em; margin: 0 0 8px; }
    .intro { margin: 0 0 28px; line-height: 1.7; color: var(--muted); }
    .cat { margin: 8px 0 28px; }
    .cat h2 { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--blue); margin: 0 0 12px; }
    .topic { background: #fff; border: 1px solid var(--line); border-radius: 22px; padding: 6px 22px 10px; margin: 0 0 12px; box-shadow: 0 1px 2px rgba(16,24,40,.03); }
    .topic h3 { font-size: 1.05rem; letter-spacing: -0.03em; margin: 16px 0 4px; }
    .qa { padding: 14px 0; border-top: 1px solid var(--line); }
    .topic .qa:first-of-type { border-top: 0; }
    .q { margin: 0 0 6px; font-weight: 600; color: var(--text); line-height: 1.45; }
    .a { margin: 0; line-height: 1.7; color: #3f3f46; }
    hr { border: 0; border-top: 1px solid var(--line); margin: 40px 0; }
    footer { color: #a1a1aa; font-size: 12px; }
  </style>
</head>
<body>
  <main>
    ${inner}
    <hr />
    <footer>${escapeHtml(result.storeName)} · ${escapeHtml(result.storeUrl)}</footer>
  </main>
</body>
</html>
`;
}

export function pagesToRemove(result: ScanResult, state: ReviewState) {
  const seen = new Set<string>();
  const out: { url: string; title: string; path: string }[] = [];

  function add(url: string, title: string, path: string) {
    if (!path || path === "/") return;
    const key = url.replace(/\/$/, "").toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ url, title, path });
  }

  for (const page of result.pagesScanned) {
    if (POLICY_PAGE.test(page.path)) add(page.url, page.title, page.path);
  }

  for (const fact of approvedFacts(result, state)) {
    for (const claim of fact.rejectedClaims) {
      for (const source of claim.sources) {
        add(source.url, source.pageTitle, source.path);
      }
    }
  }

  return out;
}
