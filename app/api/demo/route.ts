import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = process.env.DEMO_LEADS_TO ?? "orel@assis.care";
const FROM_EMAIL =
  process.env.DEMO_LEADS_FROM ?? "Assis Website <onboarding@resend.dev>";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company } = await req.json();
    if (!name || !email || !company) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Email is not configured" },
        { status: 500 },
      );
    }

    const lead = {
      name: String(name).trim(),
      email: String(email).trim(),
      company: String(company).trim(),
      date: new Date().toISOString(),
    };

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: lead.email,
      subject: `New demo request — ${lead.company}`,
      text: [
        "New Assis demo request",
        "",
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Company: ${lead.company}`,
        `Date: ${lead.date}`,
      ].join("\n"),
      html: `
        <h2>New Assis demo request</h2>
        <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(lead.company)}</p>
        <p><strong>Date:</strong> ${escapeHtml(lead.date)}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    console.log("Demo request emailed:", lead);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Demo request failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
