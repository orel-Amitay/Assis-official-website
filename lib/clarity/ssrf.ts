const PRIVATE_V4 =
  /^(127\.|10\.|0\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/;

export type ScanErrorCode =
  | "invalid"
  | "private"
  | "unreachable"
  | "blocked"
  | "timeout"
  | "empty"
  | "failed";

export class ScanError extends Error {
  code: ScanErrorCode;

  constructor(code: ScanErrorCode, message: string) {
    super(message);
    this.name = "ScanError";
    this.code = code;
  }
}

export function cleanUrlInput(raw: string) {
  return raw
    .trim()
    .replace(/^['"`]+|['"`]+$/g, "")
    .replace(/\s+/g, "");
}

export function parsePublicHttpUrl(raw: string) {
  const trimmed = cleanUrlInput(raw);
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withProtocol);
  } catch {
    throw new ScanError("invalid", "Enter a valid website address.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ScanError("invalid", "Only http and https addresses are allowed.");
  }

  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "::1" ||
    PRIVATE_V4.test(host)
  ) {
    throw new ScanError("private", "That address can’t be scanned.");
  }

  return new URL(url.origin);
}

export function homepageCandidates(raw: string) {
  const base = parsePublicHttpUrl(raw);
  const hosts = new Set<string>([base.hostname]);
  if (base.hostname.startsWith("www.")) hosts.add(base.hostname.slice(4));
  else hosts.add(`www.${base.hostname}`);

  const out: URL[] = [];
  const seen = new Set<string>();
  for (const host of hosts) {
    for (const protocol of ["https:", "http:"] as const) {
      const next = new URL(`${protocol}//${host}/`);
      const key = next.toString();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(next);
    }
  }

  return out.sort((a, b) => Number(b.href === base.href) - Number(a.href === base.href));
}

export function pathOf(url: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}` || "/";
  } catch {
    return url;
  }
}
