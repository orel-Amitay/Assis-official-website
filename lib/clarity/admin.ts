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

  if (email && (emails.includes(email) || email.endsWith("@assis.care") || email === "nadav@assis.care")) return true;
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
        answers: knowledgeJson(parsed.result, parsed.state, lang, { includeNotApplicable: true }),
        questionnaire: (parsed.state.customQas || []).map((item) => ({
          id: item.id,
          groupId: item.groupId,
          section: item.section,
          detailName: item.detailName,
          question: item.question,
          answer: item.answer,
          skipped: item.skipped,
          notApplicable: item.notApplicable,
          suggestedAnswer: item.suggestedAnswer,
          verdict: item.verdict,
          sourceUrl: item.sourceUrl,
          sourceTitle: item.sourceTitle,
        })),
      },
    ];
  });
}

export async function copyAdminDraft(input: {
  sourceUserId: string;
  sourceDraftId: string;
  destUserId: string;
  destDraftId: string;
}) {
  await ensureClaritySchema();
  const db = sql();
  const updated = (await db`
    UPDATE clarity_drafts AS dest
    SET
      store_url = src.store_url,
      store_name = src.store_name,
      scanned_at = src.scanned_at,
      pages = src.pages,
      demo = src.demo,
      lang = src.lang,
      payload = src.payload,
      saved_at = now(),
      deleted_at = NULL
    FROM clarity_drafts AS src
    WHERE src.user_id = ${input.sourceUserId}
      AND src.id = ${input.sourceDraftId}
      AND dest.user_id = ${input.destUserId}
      AND dest.id = ${input.destDraftId}
    RETURNING dest.id, dest.store_name, dest.store_url, dest.saved_at
  `) as { id: string; store_name: string; store_url: string; saved_at: string | Date }[];
  return updated[0] || null;
}
