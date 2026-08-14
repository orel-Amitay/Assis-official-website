import { NextResponse } from "next/server";
import { demoMraDraft } from "@/lib/clarity/demo";
import { aiFillOpenQuestions, aiFillStore, hasCategoryAi } from "@/lib/clarity/ai-fill";
import { templateQas } from "@/lib/clarity/import-kb";
import { scanStoreWithPages } from "@/lib/clarity/scan";
import { ScanError } from "@/lib/clarity/ssrf";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string; demo?: boolean; lang?: string };
    if (body.demo) {
      return NextResponse.json(demoMraDraft().result);
    }

    const url = String(body.url || "").trim();
    if (!url) {
      return NextResponse.json(
        { error: "Enter a store website.", code: "invalid" },
        { status: 400 },
      );
    }

    const lang = body.lang === "en" ? "en" : "he";
    const { result, pages } = await scanStoreWithPages(url);
    const usedAi = hasCategoryAi();
    const aiAnswers = usedAi ? await aiFillStore({ pages, lang }) : [];
    const openQas = usedAi
      ? await aiFillOpenQuestions({
          pages,
          lang,
          existingQuestions: templateQas().map((item) => item.question),
        })
      : [];
    return NextResponse.json({ ...result, aiAnswers, openQas, usedAi });
  } catch (error) {
    const scanError = error instanceof ScanError ? error : null;
    const message = scanError?.message || (error instanceof Error ? error.message : "Scan failed. Please try again.");
    const code = scanError?.code || "failed";
    const status = code === "invalid" || code === "private" ? 400 : 502;
    console.error("Clarity scan failed:", { code, message, error });
    return NextResponse.json({ error: message, code }, { status });
  }
}
