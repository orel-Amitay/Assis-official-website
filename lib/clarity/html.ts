export function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) => {
      const n = Number(code);
      return Number.isFinite(n) ? String.fromCharCode(n) : _;
    });
}

export function extractTitle(html: string) {
  const og = html.match(
    /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
  );
  if (og?.[1]) return decodeEntities(og[1]).trim();
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title?.[1]) {
    return decodeEntities(title[1].replace(/\s+/g, " ")).trim().slice(0, 120);
  }
  return "";
}

export function extractLinks(html: string, baseUrl: string) {
  const hrefs = [...html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi)];
  const out = new Set<string>();
  for (const match of hrefs) {
    try {
      const url = new URL(match[1], baseUrl);
      if (url.origin !== new URL(baseUrl).origin) continue;
      url.hash = "";
      out.add(url.toString());
    } catch {
      /* ignore bad href */
    }
  }
  return [...out];
}

export function extraMetaText(html: string) {
  const bits: string[] = [];
  for (const match of html.matchAll(
    /<meta[^>]+(?:name|property)=["'](?:description|og:description|og:title)["'][^>]+content=["']([^"']+)["']/gi,
  )) {
    if (match[1]) bits.push(decodeEntities(match[1]));
  }
  for (const match of html.matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    bits.push(decodeEntities(match[1].replace(/[{}\[\]"]/g, " ")));
  }
  return bits.join(". ").replace(/\s+/g, " ").trim();
}

export function htmlToText(html: string) {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|li|h1|h2|h3|h4|h5|tr|section|article|blockquote|footer|header)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ");

  return decodeEntities(cleaned)
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function splitSentences(text: string) {
  return text
    .split(/(?<=[.!?•]|[\u05be])\s+|\n+| \| /)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter((part) => part.length >= 12 && part.length <= 360);
}
