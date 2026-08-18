import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { databaseUrl } from "@/lib/clarity/db";
import { deleteClarityDraft, getClarityDraft, upsertClarityUser } from "@/lib/clarity/cloud";
import type { Session } from "next-auth";

export const maxDuration = 60;

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

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();
  if (!databaseUrl()) return noDatabase();

  const { id } = await context.params;
  const account = accountFromSession(session);
  await upsertClarityUser(account);
  const draft = await getClarityDraft(account, decodeURIComponent(id));
  if (!draft) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ draft });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) return unauthorized();
  if (!databaseUrl()) return noDatabase();

  const { id } = await context.params;
  const account = accountFromSession(session);
  await upsertClarityUser(account);
  await deleteClarityDraft(account, decodeURIComponent(id));
  return NextResponse.json({ ok: true });
}
