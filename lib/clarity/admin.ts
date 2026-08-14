import type { Session } from "next-auth";
import type { AdminDraftAnswers } from "./admin-types";
import type { ClarityLang } from "./copy";
import { ensureClaritySchema, sql } from "./db";
import { parseDraftFile } from "./draft";
import { knowledgeJson } from "./review-state";

export type { AdminDraftAnswers } from "./admin-types";

function splitList(value?: string) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function isClarityAdmin(session?: Session | null, secret?: string | null) {
  const configuredSecret = String(process.env.CLARITY_ADMIN_SECRET || "").trim();
  if (configuredSecret && secret && secret === configuredSecret) return true;

  const email = String(session?.user?.email || "").trim().toLowerCase();
  const name = String(session?.user?.name || "").trim().toLowerCase();
  const emails = splitList(process.env.CLARITY_ADMIN_EMAILS);
  const usernames = splitList(process.env.CLARITY_ADMIN_USERNAMES);

  if (email && (emails.includes(email) || email.endsWith("@assis.care"))) return true;
  if (name && usernames.includes(name)) return true;
  return false;
}

export async function listAdminDraftAnswers(): Promise<AdminDraftAnswers[]> {
  await ensureClaritySchema();
  const db = sql();
  const rows = (await db`
    SELECT
      u.id AS user_id,
      u.email,
      u.name,
      u.username,
      d.id AS draft_id,
      d.store_url,
      d.store_name,
      d.saved_at,
      d.lang,
      d.deleted_at,
      d.payload
    FROM clarity_drafts d
    JOIN clarity_users u ON u.id = d.user_id
    ORDER BY d.saved_at DESC
  `) as {
    user_id: string;
    email: string | null;
    name: string | null;
    username: string | null;
    draft_id: string;
    store_url: string;
    store_name: string;
    saved_at: string | Date;
    lang: string | null;
    deleted_at: string | Date | null;
    payload: unknown;
  }[];

  return rows.flatMap((row) => {
    const parsed =
      typeof row.payload === "string"
        ? parseDraftFile(row.payload)
        : parseDraftFile(JSON.stringify(row.payload));
    if (!parsed?.result || !parsed.state) return [];
    const lang: ClarityLang = parsed.lang === "en" ? "en" : "he";
    return [
      {
        userId: row.user_id,
        email: row.email,
        name: row.name,
        username: row.username,
        draftId: row.draft_id,
        storeUrl: row.store_url || parsed.result.storeUrl,
        storeName: row.store_name || parsed.result.storeName,
        savedAt: row.saved_at instanceof Date ? row.saved_at.toISOString() : String(row.saved_at),
        deleted: Boolean(row.deleted_at),
        lang,
        answers: knowledgeJson(parsed.result, parsed.state, lang),
      },
    ];
  });
}
