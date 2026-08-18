import type { ClaimSource } from "./types";

export function friendlyPageLabel(source: Pick<ClaimSource, "pageTitle" | "path">, homeLabel = "Home") {
  let path = source.path || "/";
  try {
    path = decodeURIComponent(path);
  } catch {
    /* keep */
  }
  const title = source.pageTitle?.replace(/\s+/g, " ").trim() || "";
  if (path === "/" || path === "") return homeLabel;
  if (title && title !== path && !/^https?:/i.test(title) && title.length < 90) {
    return title;
  }
  return path
    .replace(/^\/pages\//, "")
    .replace(/^\/policies\//, "")
    .replace(/[-_]+/g, " ")
    .replace(/\//g, " · ");
}

export function textFragmentUrl(url: string, quote: string) {
  const snippet = quote.replace(/\s+/g, " ").trim();
  if (!snippet) return url;
  const words = snippet.split(" ").filter(Boolean);
  const frag = words.length > 10 ? words.slice(0, 8).join(" ") : snippet;
  const base = url.split("#")[0];
  return `${base}#:~:text=${encodeURIComponent(frag)}`;
}

export function matchPageSource(
  url: string | undefined,
  pages: Array<{ url: string; title: string; path: string }>,
): { url: string; pageTitle: string; path: string } | null {
  const raw = String(url || "").trim();
  if (!raw || pages.length === 0) return null;
  const norm = (value: string) =>
    value.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "").toLowerCase();
  const target = norm(raw);
  const hit =
    pages.find((page) => norm(page.url) === target) ||
    pages.find((page) => target.endsWith(norm(page.path)) || norm(page.url).includes(target) || target.includes(norm(page.path).replace(/^\//, "")));
  if (!hit) {
    try {
      const parsed = new URL(raw);
      return { url: parsed.toString(), pageTitle: parsed.pathname, path: parsed.pathname };
    } catch {
      return null;
    }
  }
  return { url: hit.url, pageTitle: hit.title, path: hit.path };
}

export function excerptAround(sentences: string[], index: number) {
  return [sentences[index - 1], sentences[index], sentences[index + 1]]
    .filter(Boolean)
    .join(" ")
    .trim();
}
