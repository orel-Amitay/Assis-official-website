import { extraMetaText, extractLinks, extractTitle, htmlToText } from "./html";
import { buildScanResult, isReviewPage, type PageSnapshot } from "./extract";
import { fetchHtml, fetchJson, openStore } from "./fetch-page";
import { COMMON_POLICY_PATHS, POLICY_PATH_HINT, SKIP_PATH, TOPICS } from "./topics";
import { ScanError, pathOf } from "./ssrf";
import type { ScanResult, TopicGroupId } from "./types";

const MAX_HTML_PAGES = 120;
const MAX_ATTEMPTS = 260;
const MAX_PRODUCT_JSON_PAGES = 12;
const MAX_SITEMAP_CHILDREN = 12;
const MAX_BLOG_ARTICLES = 40;

function normalizeUrl(url: string) {
  return url.replace(/\/$/, "") || url;
}

function isCrawlableUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (SKIP_PATH.test(parsed.pathname)) return false;
    if (isReviewPage(parsed.pathname)) return false;
    return true;
  } catch {
    return false;
  }
}

function urlPriority(url: string) {
  try {
    const path = new URL(url).pathname;
    if (/\/policies\//i.test(path) || POLICY_PATH_HINT.test(path)) return 0;
    if (/\/pages\//i.test(path)) return 1;
    if (/\/collections\//i.test(path)) return 2;
    if (/\/products\//i.test(path)) return 3;
    if (/\/blogs?\//i.test(path)) return 4;
    return 5;
  } catch {
    return 9;
  }
}

function locUrlsFromSitemap(xml: string, origin: string) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)]
    .map((match) => {
      try {
        const url = new URL(match[1].trim(), origin);
        if (url.origin !== origin) return null;
        url.hash = "";
        return url.toString();
      } catch {
        return null;
      }
    })
    .filter((url): url is string => Boolean(url));
}

async function sitemapUrls(homeUrl: URL) {
  const found = new Set<string>();
  const sitemapFiles = new Set<string>([
    new URL("/sitemap.xml", homeUrl).toString(),
    new URL("/sitemap_index.xml", homeUrl).toString(),
  ]);

  try {
    const robots = await fetchHtml(new URL("/robots.txt", homeUrl).toString(), 3500);
    if (robots) {
      for (const match of robots.html.matchAll(/^sitemap:\s*(\S+)/gim)) {
        try {
          const url = new URL(match[1], homeUrl);
          if (url.origin === homeUrl.origin) sitemapFiles.add(url.toString());
        } catch {
          /* ignore */
        }
      }
    }
  } catch {
    /* optional */
  }

  const childSitemaps: string[] = [];
  for (const sitemapUrl of sitemapFiles) {
    try {
      const fetched = await fetchHtml(sitemapUrl, 5000);
      if (!fetched) continue;
      const locs = locUrlsFromSitemap(fetched.html, homeUrl.origin);
      for (const loc of locs) {
        if (/sitemap/i.test(loc) && /\.xml(\?|$)/i.test(loc)) {
          if (!/image|video|atom/i.test(loc)) childSitemaps.push(loc);
        } else if (isCrawlableUrl(loc)) {
          found.add(loc);
        }
      }
    } catch {
      /* optional */
    }
  }

  const rankedChildren = [...new Set(childSitemaps)].sort((a, b) => {
    const score = (url: string) => {
      if (/products?/i.test(url)) return 0;
      if (/pages|policies|important/i.test(url)) return 1;
      if (/collections?/i.test(url)) return 2;
      return 3;
    };
    return score(a) - score(b);
  });

  for (const child of rankedChildren.slice(0, MAX_SITEMAP_CHILDREN)) {
    try {
      const fetched = await fetchHtml(child, 5000);
      if (!fetched) continue;
      for (const loc of locUrlsFromSitemap(fetched.html, homeUrl.origin)) {
        if (isCrawlableUrl(loc)) found.add(loc);
      }
    } catch {
      /* optional */
    }
  }

  return [...found];
}

type ShopifyPage = { title?: string; handle?: string; body_html?: string };
type ShopifyProduct = {
  title?: string;
  handle?: string;
  body_html?: string;
  tags?: string;
  product_type?: string;
  variants?: { title?: string; option1?: string; option2?: string; option3?: string }[];
};
type ShopifyCollection = { title?: string; handle?: string; body_html?: string };

function snapshotFromHtmlBody(url: string, title: string, path: string, html: string, extra = "") {
  const text = [title, extra, html ? htmlToText(html) : ""].filter(Boolean).join(". ").trim();
  if (text.length < 40) return null;
  return { url, title: title || path, path, text: text.slice(0, 18000) } satisfies PageSnapshot;
}

function mergeSnapshots(a: PageSnapshot, b: PageSnapshot): PageSnapshot {
  const text = a.text.includes(b.text.slice(0, 80))
    ? a.text.length >= b.text.length
      ? a.text
      : b.text
    : `${a.text}\n\n${b.text}`.slice(0, 18000);
  return { ...a, title: a.title || b.title, text };
}

function isHighValueUrl(url: string) {
  try {
    const path = new URL(url).pathname;
    return /\/policies\//i.test(path) || /\/pages\//i.test(path) || /\/blogs?\//i.test(path) || POLICY_PATH_HINT.test(path);
  } catch {
    return false;
  }
}

async function shopifyPageSnapshots(origin: string): Promise<PageSnapshot[]> {
  const data = await fetchJson<{ pages?: ShopifyPage[] }>(`${origin}/pages.json`);
  if (!data?.pages?.length) return [];

  const snapshots: PageSnapshot[] = [];
  for (const page of data.pages) {
    if (!page.handle) continue;
    const snap = snapshotFromHtmlBody(
      `${origin}/pages/${page.handle}`,
      page.title || page.handle,
      `/pages/${page.handle}`,
      page.body_html || "",
    );
    if (snap) snapshots.push(snap);
  }
  return snapshots;
}

async function shopifyProductSnapshots(origin: string): Promise<PageSnapshot[]> {
  const snapshots: PageSnapshot[] = [];
  for (let page = 1; page <= MAX_PRODUCT_JSON_PAGES; page++) {
    const data = await fetchJson<{ products?: ShopifyProduct[] }>(
      `${origin}/products.json?limit=250&page=${page}`,
    );
    const products = data?.products;
    if (!products?.length) break;
    for (const product of products) {
      if (!product.handle) continue;
      const variantText = (product.variants || [])
        .map((variant) => [variant.title, variant.option1, variant.option2, variant.option3].filter(Boolean).join(" "))
        .join(". ");
      const extra = [product.product_type, product.tags, variantText].filter(Boolean).join(". ");
      const snap = snapshotFromHtmlBody(
        `${origin}/products/${product.handle}`,
        product.title || product.handle,
        `/products/${product.handle}`,
        product.body_html || "",
        extra,
      );
      if (snap) snapshots.push(snap);
    }
    if (products.length < 250) break;
  }
  return snapshots;
}

async function shopifyArticleSnapshots(origin: string): Promise<PageSnapshot[]> {
  const blogs = await fetchJson<{ blogs?: { handle?: string; title?: string }[] }>(`${origin}/blogs.json`);
  if (!blogs?.blogs?.length) return [];

  const snapshots: PageSnapshot[] = [];
  for (const blog of blogs.blogs) {
    if (!blog.handle || snapshots.length >= MAX_BLOG_ARTICLES) break;
    const data = await fetchJson<{ articles?: { title?: string; handle?: string; body_html?: string; summary_html?: string }[] }>(
      `${origin}/blogs/${blog.handle}/articles.json?limit=50`,
    );
    for (const article of data?.articles || []) {
      if (!article.handle || snapshots.length >= MAX_BLOG_ARTICLES) break;
      const snap = snapshotFromHtmlBody(
        `${origin}/blogs/${blog.handle}/${article.handle}`,
        article.title || article.handle,
        `/blogs/${blog.handle}/${article.handle}`,
        article.body_html || article.summary_html || "",
      );
      if (snap) snapshots.push(snap);
    }
  }
  return snapshots;
}

async function shopifyCollectionSnapshots(origin: string): Promise<PageSnapshot[]> {
  const data = await fetchJson<{ collections?: ShopifyCollection[] }>(`${origin}/collections.json?limit=250`);
  if (!data?.collections?.length) return [];

  const snapshots: PageSnapshot[] = [];
  for (const collection of data.collections) {
    if (!collection.handle) continue;
    const snap = snapshotFromHtmlBody(
      `${origin}/collections/${collection.handle}`,
      collection.title || collection.handle,
      `/collections/${collection.handle}`,
      collection.body_html || "",
    );
    if (snap) snapshots.push(snap);
  }
  return snapshots;
}

function pageTitleFrom(html: string, fallbackPath: string) {
  const title = extractTitle(html);
  if (!title) return fallbackPath === "/" ? "Home" : fallbackPath;
  return title.split(/[|\-–—]/)[0]?.trim() || title;
}

function toSnapshot(finalUrl: string, html: string): PageSnapshot | null {
  const text = [htmlToText(html), extraMetaText(html)].filter(Boolean).join("\n");
  if (text.length < 40) return null;
  return {
    url: finalUrl,
    title: pageTitleFrom(html, pathOf(finalUrl)),
    path: pathOf(finalUrl),
    text: text.slice(0, 18000),
  };
}

async function fetchPages(urls: string[], homepage?: { url: string; html: string }) {
  const pages: PageSnapshot[] = [];
  const seen = new Set<string>();
  const queue = urls
    .filter((url) => {
      const key = normalizeUrl(url);
      if (seen.has(key) || !isCrawlableUrl(url)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => urlPriority(a) - urlPriority(b))
    .slice(0, MAX_ATTEMPTS);

  if (homepage) {
    const snap = toSnapshot(homepage.url, homepage.html);
    if (snap) pages.push(snap);
  }

  let index = 0;
  const workers = Array.from({ length: 4 }, async () => {
    while (index < queue.length && pages.length < MAX_HTML_PAGES) {
      const url = queue[index++];
      if (!url) break;
      if (homepage && normalizeUrl(url) === normalizeUrl(homepage.url)) continue;
      try {
        const fetched = await fetchHtml(url);
        if (!fetched) continue;
        const snap = toSnapshot(fetched.finalUrl || url, fetched.html);
        if (snap) pages.push(snap);
      } catch {
        /* skip */
      }
    }
  });

  await Promise.all(workers);
  return pages;
}

export async function scanStoreWithPages(rawUrl: string): Promise<{ result: ScanResult; pages: PageSnapshot[] }> {
  const opened = await openStore(rawUrl);
  const origin = opened.origin;
  const originUrl = new URL(origin);
  const storeName = opened.storeName;

  const fromHome = opened.home
    ? extractLinks(opened.home.html, opened.home.url).filter((url) => isCrawlableUrl(url))
    : [];
  const [fromSitemap, shopifyPages, shopifyProducts, shopifyCollections, shopifyArticles] = await Promise.all([
    sitemapUrls(originUrl),
    shopifyPageSnapshots(origin),
    shopifyProductSnapshots(origin),
    shopifyCollectionSnapshots(origin),
    shopifyArticleSnapshots(origin),
  ]);
  const common = COMMON_POLICY_PATHS.map((path) => new URL(path, originUrl).toString());

  const jsonOnly = new Set(
    [...shopifyProducts, ...shopifyCollections].map((page) => normalizeUrl(page.url)),
  );
  const queue = [originUrl.toString(), ...fromHome, ...fromSitemap, ...common, ...shopifyPages.map((page) => page.url), ...shopifyArticles.map((page) => page.url)].filter(
    (url) => {
      const key = normalizeUrl(url);
      if (jsonOnly.has(key) && !isHighValueUrl(url)) return false;
      return true;
    },
  );

  const fetchedPages = await fetchPages(
    queue,
    opened.home ? { url: opened.home.url, html: opened.home.html } : undefined,
  );
  const pagesByUrl = new Map<string, PageSnapshot>();
  for (const page of [...shopifyPages, ...shopifyProducts, ...shopifyCollections, ...shopifyArticles, ...fetchedPages]) {
    const key = normalizeUrl(page.url);
    const existing = pagesByUrl.get(key);
    pagesByUrl.set(key, existing ? mergeSnapshots(existing, page) : page);
  }
  const pages = [...pagesByUrl.values()];

  if (pages.length === 0) {
    throw new ScanError("empty", "The site opened, but we couldn’t read enough page content.");
  }

  return {
    result: buildScanResult({
      storeUrl: origin,
      storeName,
      pages,
    }),
    pages,
  };
}

export async function scanStore(rawUrl: string): Promise<ScanResult> {
  const { result } = await scanStoreWithPages(rawUrl);
  return result;
}

export async function scanCategoryStore(
  rawUrl: string,
  groupId: TopicGroupId,
): Promise<{ storeUrl: string; storeName: string; pages: PageSnapshot[] }> {
  const opened = await openStore(rawUrl);
  const origin = opened.origin;
  const originUrl = new URL(origin);
  const topics = TOPICS.filter((topic) => topic.group === groupId);
  const matchesGroup = (path: string, title = "") =>
    topics.some((topic) => topic.pathHints.test(path) || topic.pathHints.test(title));

  const fromHome = opened.home
    ? extractLinks(opened.home.html, opened.home.url).filter((url) => {
        try {
          return matchesGroup(pathOf(url));
        } catch {
          return false;
        }
      })
    : [];
  const common = COMMON_POLICY_PATHS.map((path) => new URL(path, originUrl).toString()).filter((url) =>
    matchesGroup(pathOf(url)),
  );
  let shopifyPages: PageSnapshot[] = [];
  try {
    shopifyPages = (await shopifyPageSnapshots(origin)).filter((page) => matchesGroup(page.path, page.title));
  } catch {
    shopifyPages = [];
  }

  const fetched = await fetchPages(
    [originUrl.toString(), ...fromHome, ...common, ...shopifyPages.map((page) => page.url)].slice(0, 50),
    opened.home ? { url: opened.home.url, html: opened.home.html } : undefined,
  );
  const pagesByUrl = new Map<string, PageSnapshot>();
  for (const page of [...shopifyPages, ...fetched]) {
    pagesByUrl.set(normalizeUrl(page.url), page);
  }
  const pages = [...pagesByUrl.values()].slice(0, 30);
  if (pages.length === 0) {
    throw new ScanError("empty", "The site opened, but we couldn’t read enough page content.");
  }
  return { storeUrl: origin, storeName: opened.storeName, pages };
}
