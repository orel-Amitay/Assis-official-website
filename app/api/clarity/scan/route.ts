import { NextResponse } from "next/server";
import { demoMraDraft } from "@/lib/clarity/demo";
import { aiFillStore, hasCategoryAi } from "@/lib/clarity/ai-fill";
import { scanStoreWithPages } from "@/lib/clarity/scan";
import { ScanError } from "@/lib/clarity/ssrf";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

function jsonError(message: string, code: string, status: number) {
  return NextResponse.json({ error: message, code }, { status });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string; demo?: boolean; lang?: string };
    if (body.demo) {
      return NextResponse.json(demoMraDraft().result);
    }

    const url = String(body.url || "").trim();
    if (!url) {
      return jsonError("Enter a store website.", "invalid", 400);
    }

    const lang = body.lang === "en" ? "en" : "he";
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (payload: unknown) => {
          controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
        };
        try {
          send({ type: "phase", phase: "crawl" });
          const { result, pages } = await scanStoreWithPages(url);
          const usedAi = hasCategoryAi();
          if (usedAi) send({ type: "phase", phase: "fill" });
          const aiAnswers = usedAi
            ? await aiFillStore({
                pages,
                lang,
                onProgress: (event) => send({ type: "fill", ...event }),
              })
            : [];
          send({ type: "done", result: { ...result, aiAnswers, openQas: [], usedAi } });
        } catch (error) {
          const scanError = error instanceof ScanError ? error : null;
          const message =
            scanError?.message || (error instanceof Error ? error.message : "Scan failed. Please try again.");
          const code = scanError?.code || "failed";
          console.error("Clarity scan failed:", { code, message, error });
          send({ type: "error", error: message, code });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    const scanError = error instanceof ScanError ? error : null;
    const message = scanError?.message || (error instanceof Error ? error.message : "Scan failed. Please try again.");
    const code = scanError?.code || "failed";
    const status = code === "invalid" || code === "private" ? 400 : 502;
    console.error("Clarity scan failed:", { code, message, error });
    return jsonError(message, code, status);
  }
}
