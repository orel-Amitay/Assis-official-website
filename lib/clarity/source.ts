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

export function excerptAround(sentences: string[], index: number) {
  return [sentences[index - 1], sentences[index], sentences[index + 1]]
    .filter(Boolean)
    .join(" ")
    .trim();
}
