import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { runCategoryScan } from "@/lib/clarity/category-scan";
import { GROUPS } from "@/lib/clarity/topics";
import { ScanError } from "@/lib/clarity/ssrf";
import type { TopicGroupId } from "@/lib/clarity/types";

export const maxDuration = 90;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to scan." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { url?: string; groupId?: string; lang?: string };
    const url = String(body.url || "").trim();
    const groupId = String(body.groupId || "") as TopicGroupId;
    if (!url || !GROUPS.some((group) => group.id === groupId)) {
      return NextResponse.json({ error: "Invalid category scan." }, { status: 400 });
    }
    const result = await runCategoryScan(url, groupId, body.lang === "en" ? "en" : "he");
    return NextResponse.json(result);
  } catch (error) {
    const scanError = error instanceof ScanError ? error : null;
    const message = scanError?.message || (error instanceof Error ? error.message : "Scan failed");
    const code = scanError?.code || "failed";
    const status = code === "invalid" || code === "private" ? 400 : 502;
    console.error("Clarity category scan failed:", { code, message, error });
    return NextResponse.json({ error: message, code }, { status });
  }
}
