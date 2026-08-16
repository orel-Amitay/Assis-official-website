import { NextResponse } from "next/server";
import { fetchHtml } from "@/lib/clarity/fetch-page";
import { findHighlightSnippet, highlightPreviewScript, previewStyles } from "@/lib/clarity/preview";
import { ScanError, parsePublicHttpUrl } from "@/lib/clarity/ssrf";

export const maxDuration = 20;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sanitizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, " ")
    .replace(/<object[\s\S]*?<\/object>/gi, " ")
    .replace(/<embed\b[^>]*>/gi, " ")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, "");
}

function injectPreview(html: string, finalUrl: string, quote: string) {
  const headBits = `<base href="${escapeHtml(finalUrl)}">${previewStyles()}`;
  const tail = highlightPreviewScript(quote);
  let next = html;
  if (/<head[^>]*>/i.test(next)) {
    next = next.replace(/<head[^>]*>/i, (match) => `${match}${headBits}`);
  } else {
    next = `<!doctype html><html><head>${headBits}</head><body>${next}</body></html>`;
  }
  if (/<\/body>/i.test(next)) {
    next = next.replace(/<\/body>/i, `${tail}</body>`);
  } else {
    next += tail;
  }
  return next;
}

export async function GET(req: Request) {
  try {
    const incoming = new URL(req.url);
    const rawUrl = String(incoming.searchParams.get("url") || "").trim();
    const quote = String(incoming.searchParams.get("quote") || incoming.searchParams.get("excerpt") || "")
      .trim()
      .slice(0, 400);
    const excerpt = String(incoming.searchParams.get("excerpt") || "").trim().slice(0, 400);
    const question = String(incoming.searchParams.get("question") || "").trim().slice(0, 240);
    if (!rawUrl) return new NextResponse("Missing url", { status: 400 });

    parsePublicHttpUrl(rawUrl);
    const target = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
    if (target.protocol !== "http:" && target.protocol !== "https:") {
      return new NextResponse("Invalid url", { status: 400 });
    }

    const fetched = await fetchHtml(target.toString(), 10000);
    if (!fetched) return new NextResponse("Could not load page", { status: 502 });

    const snippet = findHighlightSnippet(fetched.html, [quote, excerpt, question]);
    const html = injectPreview(sanitizeHtml(fetched.html), fetched.finalUrl, snippet || quote);

    return new NextResponse(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "x-frame-options": "SAMEORIGIN",
        "content-security-policy": "frame-ancestors 'self'",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof ScanError) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Preview failed", { status: 502 });
  }
}
