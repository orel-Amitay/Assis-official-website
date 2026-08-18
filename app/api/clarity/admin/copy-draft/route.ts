import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { copyAdminDraft, isClarityAdmin } from "@/lib/clarity/admin";
import { databaseUrl } from "@/lib/clarity/db";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!databaseUrl()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const session = await auth();
  if (!isClarityAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    sourceUserId?: string;
    sourceDraftId?: string;
    destUserId?: string;
    destDraftId?: string;
  } | null;

  const sourceUserId = String(body?.sourceUserId || "").trim();
  const sourceDraftId = String(body?.sourceDraftId || "").trim();
  const destUserId = String(body?.destUserId || "").trim();
  const destDraftId = String(body?.destDraftId || "").trim();
  if (!sourceUserId || !sourceDraftId || !destUserId || !destDraftId) {
    return NextResponse.json({ error: "Missing draft ids." }, { status: 400 });
  }
  if (sourceUserId === destUserId && sourceDraftId === destDraftId) {
    return NextResponse.json({ error: "Source and destination are the same." }, { status: 400 });
  }

  const copied = await copyAdminDraft({ sourceUserId, sourceDraftId, destUserId, destDraftId });
  if (!copied) {
    return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, copied }, { headers: { "Cache-Control": "no-store" } });
}
