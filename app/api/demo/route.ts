import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company } = await req.json();
    if (!name || !email || !company) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const lead = { name, email, company, date: new Date().toISOString() };
    const filePath = join(process.cwd(), "leads.json");
    const existing = existsSync(filePath)
      ? JSON.parse(readFileSync(filePath, "utf-8"))
      : [];
    existing.push(lead);
    writeFileSync(filePath, JSON.stringify(existing, null, 2));
    console.log("New demo request:", lead);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
