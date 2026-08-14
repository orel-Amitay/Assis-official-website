import dns from "node:dns";
import { ScanError, homepageCandidates } from "./ssrf";
import { extractTitle } from "./html";

dns.setDefaultResultOrder("ipv4first");

const HOME_TIMEOUT_MS = 25000;
const PAGE_TIMEOUT_MS = 8000;
const MAX_HTML_BYTES = 1_200_000;

const CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const SIMPLE_HEADERS = {
  "User-Agent": CHROME_UA,
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Upgrade-Insecure-Requests": "1",
  Referer: "https://www.google.com/",
};

const JSON_HEADERS = {
  "User-Agent": CHROME_UA,
  Accept: "application/json,text/plain,*/*",
  "Accept-Language": "he-IL,he;q=0.9,en;q=0.8",
};

type HeaderMap = Record<string, string>;

function isChallengePage(html: string) {
  return /cf-browser-verification|cf-error-details|just a moment\.\.\.|checking your browser before|verify you are human|sorry, you have been blocked|attention required!\s*\|?\s*cloudflare/i.test(
    html,
  );
}

function looksLikeStorefront(html: string) {
  if (html.length < 4000) return false;
  return /shopify|myshopify|cdn\.shopify|woocommerce|wixstatic|squarespace|bigcommerce|data-product|add[- ]to[- ]cart|הוספה לסל|עגלת/i.test(
    html,
  );
}

type FetchOk = { ok: true; finalUrl: string; html: string; contentType: string };
type FetchFail = {
  ok: false;
  status?: number;
  reason: "http" | "network" | "timeout" | "type" | "empty" | "blocked";
};

async function readLimited(response: Response) {
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength === 0) return "";
  const slice = buffer.byteLength > MAX_HTML_BYTES ? buffer.slice(0, MAX_HTML_BYTES) : buffer;
  return new TextDecoder("utf-8").decode(slice);
}

export async function fetchHtmlDetailed(
  url: string,
  timeoutMs = PAGE_TIMEOUT_MS,
  headers: HeaderMap = SIMPLE_HEADERS,
): Promise<FetchOk | FetchFail> {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    });
    const contentType = response.headers.get("content-type") || "";
    const html = /html|xml|text\/plain|json|charset/i.test(contentType) || !contentType ? await readLimited(response) : "";

    if (response.status === 401 || response.status === 403 || response.status === 429) {
      if (html && !isChallengePage(html) && looksLikeStorefront(html)) {
        return { ok: true, finalUrl: response.url || url, html, contentType };
      }
      return { ok: false, status: response.status, reason: "blocked" };
    }
    if (!response.ok) return { ok: false, status: response.status, reason: "http" };
    if (contentType && !/html|xml|text\/plain|json|charset/i.test(contentType)) {
      return { ok: false, status: response.status, reason: "type" };
    }
    if (!html) return { ok: false, reason: "empty" };
    if (isChallengePage(html) && !looksLikeStorefront(html)) {
      return { ok: false, status: response.status, reason: "blocked" };
    }
    return { ok: true, finalUrl: response.url || url, html, contentType };
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    if (name === "TimeoutError" || name === "AbortError") {
      return { ok: false, reason: "timeout" };
    }
    return { ok: false, reason: "network" };
  }
}

export async function fetchHtml(url: string, timeoutMs = PAGE_TIMEOUT_MS) {
  const first = await fetchHtmlDetailed(url, timeoutMs, SIMPLE_HEADERS);
  if (first.ok) return { finalUrl: first.finalUrl, html: first.html, contentType: first.contentType };
  if (first.reason === "blocked" && first.status === 429) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const retry = await fetchHtmlDetailed(url, timeoutMs, SIMPLE_HEADERS);
    if (retry.ok) return { finalUrl: retry.finalUrl, html: retry.html, contentType: retry.contentType };
  }
  return null;
}

export async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      cache: "no-store",
      headers: JSON_HEADERS,
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function myshopifyOrigins(html: string) {
  const found = new Set<string>();
  for (const match of html.matchAll(/([\w-]+)\.myshopify\.com/gi)) {
    found.add(`https://${match[1].toLowerCase()}.myshopify.com`);
  }
  return [...found];
}

function guessedShopifyOrigins(host: string) {
  const bare = host.replace(/^www\./, "").toLowerCase();
  const slug = bare.replace(/\.(co\.il|com|net|io|shop)$/i, "").replace(/\./g, "-");
  const compact = slug.replace(/-/g, "");
  return [...new Set([`https://${slug}.myshopify.com`, `https://${compact}.myshopify.com`])];
}

export type OpenedStore = {
  origin: string;
  storeName: string;
  home?: { url: string; html: string };
};

async function originIsReadable(origin: string) {
  const products = await fetchJson<{ products?: unknown[] }>(`${origin}/products.json?limit=1`);
  if (products?.products) return true;
  const pages = await fetchJson<{ pages?: unknown[] }>(`${origin}/pages.json`);
  if (pages?.pages) return true;
  const sitemap = await fetchHtml(`${origin}/sitemap.xml`, 8000);
  return Boolean(sitemap?.html && /<urlset|<sitemapindex|<loc>/i.test(sitemap.html));
}

export async function openStore(rawUrl: string): Promise<OpenedStore> {
  const candidates = homepageCandidates(rawUrl);
  let blocked = false;
  let timeout = false;
  let lastStatus: number | undefined;
  let home: { url: string; html: string } | undefined;

  const origins = new Set<string>(candidates.map((item) => item.origin));
  for (const candidate of candidates) {
    for (const guess of guessedShopifyOrigins(candidate.hostname)) origins.add(guess);
  }

  for (const candidate of candidates) {
    const result = await fetchHtmlDetailed(candidate.toString(), HOME_TIMEOUT_MS, SIMPLE_HEADERS);
    if (result.ok) {
      home = { url: result.finalUrl, html: result.html };
      origins.add(new URL(result.finalUrl).origin);
      for (const shop of myshopifyOrigins(result.html)) origins.add(shop);
      break;
    }
    if (result.reason === "timeout") timeout = true;
    if (result.reason === "blocked") blocked = true;
    if (result.status) lastStatus = result.status;
    if (result.reason === "blocked" && result.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const retry = await fetchHtmlDetailed(candidate.toString(), HOME_TIMEOUT_MS, SIMPLE_HEADERS);
      if (retry.ok) {
        home = { url: retry.finalUrl, html: retry.html };
        origins.add(new URL(retry.finalUrl).origin);
        break;
      }
    }
  }

  const preferred = [
    ...(home ? [new URL(home.url).origin] : []),
    ...candidates.map((item) => item.origin),
    ...origins,
  ];
  const seen = new Set<string>();
  let origin: string | undefined;
  for (const candidateOrigin of preferred) {
    if (seen.has(candidateOrigin)) continue;
    seen.add(candidateOrigin);
    if (home && new URL(home.url).origin === candidateOrigin) {
      origin = candidateOrigin;
      break;
    }
    if (await originIsReadable(candidateOrigin)) {
      origin = candidateOrigin;
      break;
    }
  }

  if (!origin) {
    if (timeout) {
      throw new ScanError("timeout", "The site took too long to respond. Try again in a moment.");
    }
    if (blocked) {
      throw new ScanError(
        "blocked",
        "The site blocked automated access. Try the exact homepage URL, or a Shopify *.myshopify.com address.",
      );
    }
    if (lastStatus) {
      throw new ScanError("unreachable", `The site returned ${lastStatus}. Check the address and try again.`);
    }
    throw new ScanError("unreachable", "We couldn’t open that website. Check the address and try again.");
  }

  const storeName =
    (home ? extractTitle(home.html).split(/[|\-–—]/)[0]?.trim() : "") ||
    new URL(origin).hostname.replace(/^www\./, "");

  return { origin, storeName, home };
}

/** @deprecated use openStore */
export async function openHomepage(rawUrl: string) {
  const opened = await openStore(rawUrl);
  if (opened.home) {
    return { ok: true as const, finalUrl: opened.home.url, html: opened.home.html, contentType: "text/html" };
  }
  throw new ScanError(
    "blocked",
    "The site blocked automated access. Try the exact homepage URL, or a Shopify *.myshopify.com address.",
  );
}
