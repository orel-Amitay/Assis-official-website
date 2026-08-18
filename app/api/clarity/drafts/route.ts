import { NextResponse } from "next/server";

export const maxDuration = 60;
import { auth } from "@/auth";
import { isClarityAdmin } from "@/lib/clarity/admin";
import { databaseUrl } from "@/lib/clarity/db";
import {
  deleteClarityDraft,
  getClarityDraft,
  listClarityDrafts,
  patchClarityDraftState,
  saveClarityDraft,
  upsertClarityUser,
} from "@/lib/clarity/cloud";
import { parseDraftFile, type ClarityDraft } from "@/lib/clarity/draft";
import type { ClarityLang } from "@/lib/clarity/copy";
import type { ReviewState } from "@/lib/clarity/types";
import type { Session } from "next-auth";

function unauthorized() {
  return NextResponse.json({ error: "Sign in to save drafts." }, { status: 401 });
}

function noDatabase() {
  return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
}

function accountFromSession(session: Session) {
  return {
    id: String(session.user?.id || ""),
    email: session.user?.email,
    googleSub: session.googleSub,
    name: session.user?.name,
    image: session.user?.image,
  };
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();
  if (!databaseUrl()) return noDatabase();

  try {
    const account = accountFromSession(session);
    await upsertClarityUser(account);
    const draftId = new URL(req.url).searchParams.get("id");
    if (draftId) {
      try {
        const draft = await getClarityDraft(account, draftId);
        if (!draft) return NextResponse.json({ error: "Not found." }, { status: 404 });
        return NextResponse.json({ draft });
      } catch (error) {
        const detail = error instanceof Error ? error.message : "failed";
        return NextResponse.json({ error: "Could not open draft.", detail }, { status: 500 });
      }
    }
    const drafts = await listClarityDrafts(account);
    return NextResponse.json({ drafts, admin: isClarityAdmin(session) });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "failed";
    return NextResponse.json({ error: "Could not list drafts.", detail }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();
  if (!databaseUrl()) return noDatabase();

  const draftId = new URL(req.url).searchParams.get("id");
  if (!draftId) return NextResponse.json({ error: "Missing draft id." }, { status: 400 });

  const account = accountFromSession(session);
  await upsertClarityUser(account);
  await deleteClarityDraft(account, draftId);
  return NextResponse.json({ ok: true });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();
  if (!databaseUrl()) return noDatabase();

  try {
    const account = accountFromSession(session);
    await upsertClarityUser(account);
    const body = await req.json();
    if (body?.stateOnly && body.id && body.state) {
      const patched = await patchClarityDraftState(
        account,
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

    const saved = await saveClarityDraft(account, draft);
    return NextResponse.json({ draft: saved });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "failed";
    return NextResponse.json({ error: "Could not save draft.", detail }, { status: 500 });
  }
}
