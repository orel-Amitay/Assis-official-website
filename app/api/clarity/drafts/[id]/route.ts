import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { databaseUrl } from "@/lib/clarity/db";
import { deleteClarityDraft, getClarityDraft, upsertClarityUser } from "@/lib/clarity/cloud";

function unauthorized() {
  return NextResponse.json({ error: "Sign in to save drafts." }, { status: 401 });
}

function noDatabase() {
  return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return unauthorized();
  if (!databaseUrl()) return noDatabase();

  const { id } = await context.params;
  await upsertClarityUser({
    id: userId,
    email: session.user?.email,
    name: session.user?.name,
    image: session.user?.image,
  });
  const draft = await getClarityDraft(userId, decodeURIComponent(id));
  if (!draft) return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json({ draft });
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return unauthorized();
  if (!databaseUrl()) return noDatabase();

  const { id } = await context.params;
  await deleteClarityDraft(userId, decodeURIComponent(id));
  return NextResponse.json({ ok: true });
}
