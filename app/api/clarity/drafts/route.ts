import { NextResponse } from "next/server";

export const maxDuration = 60;
import { auth } from "@/auth";
import { isClarityAdmin } from "@/lib/clarity/admin";
import { databaseUrl } from "@/lib/clarity/db";
import {
  listClarityDrafts,
  patchClarityDraftState,
  saveClarityDraft,
  upsertClarityUser,
} from "@/lib/clarity/cloud";
import { parseDraftFile, type ClarityDraft } from "@/lib/clarity/draft";
import type { ClarityLang } from "@/lib/clarity/copy";
import type { ReviewState } from "@/lib/clarity/types";

function unauthorized() {
  return NextResponse.json({ error: "Sign in to save drafts." }, { status: 401 });
}

function noDatabase() {
  return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return unauthorized();
  if (!databaseUrl()) return noDatabase();

  await upsertClarityUser({
    id: userId,
    email: session.user?.email,
    name: session.user?.name,
    image: session.user?.image,
  });
  const drafts = await listClarityDrafts(userId);
  return NextResponse.json({ drafts, admin: isClarityAdmin(session) });
}

export async function PUT(req: Request) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return unauthorized();
  if (!databaseUrl()) return noDatabase();

  try {
    await upsertClarityUser({
      id: userId,
      email: session.user?.email,
      name: session.user?.name,
      image: session.user?.image,
    });
    const body = await req.json();
    if (body?.stateOnly && body.id && body.state) {
      const patched = await patchClarityDraftState(
        userId,
        String(body.id),
        body.state as ReviewState,
        body.lang === "en" ? "en" : ("he" as ClarityLang),
      );
      if (!patched) {
        return NextResponse.json({ error: "need-full" }, { status: 409 });
      }
      return NextResponse.json({ ok: true, ...patched });
    }

    const draft = parseDraftFile(JSON.stringify(body)) as ClarityDraft | null;
    if (!draft) {
      return NextResponse.json({ error: "Invalid draft." }, { status: 400 });
    }

    const saved = await saveClarityDraft(userId, draft);
    return NextResponse.json({ draft: saved });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "failed";
    return NextResponse.json({ error: "Could not save draft.", detail }, { status: 500 });
  }
}
