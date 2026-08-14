import { NextResponse } from "next/server";
import { createPasswordUser } from "@/lib/clarity/accounts";
import { databaseUrl } from "@/lib/clarity/db";

export async function POST(req: Request) {
  if (!databaseUrl()) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }
  try {
    const body = (await req.json()) as { username?: string; password?: string; name?: string };
    const user = await createPasswordUser({
      username: String(body.username || ""),
      password: String(body.password || ""),
      name: body.name,
    });
    return NextResponse.json({
      ok: true,
      user: { id: user.id, username: user.username, name: user.name },
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "failed";
    if (code === "invalid-username") {
      return NextResponse.json({ error: "Use 3–40 letters, numbers, . _ -", code }, { status: 400 });
    }
    if (code === "weak-password") {
      return NextResponse.json({ error: "Password must be at least 6 characters.", code }, { status: 400 });
    }
    if (code === "taken") {
      return NextResponse.json({ error: "That username is already taken.", code }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not create the account.", code: "failed" }, { status: 500 });
  }
}
