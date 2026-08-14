import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isClarityAdmin, listAdminDraftAnswers } from "@/lib/clarity/admin";
import { databaseUrl } from "@/lib/clarity/db";

export const maxDuration = 60;

export async function GET(req: Request) {
  if (!databaseUrl()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const url = new URL(req.url);
  const secret =
    req.headers.get("x-clarity-admin-secret") || url.searchParams.get("secret") || "";
  const session = await auth();
  if (!isClarityAdmin(session, secret)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const drafts = await listAdminDraftAnswers();
  return NextResponse.json({ drafts });
}
