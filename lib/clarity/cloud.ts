import type { ClarityDraft, ClarityDraftMeta } from "./draft";
import { ensureClaritySchema, sql } from "./db";
import { parseDraftFile } from "./draft";
import type { ClarityLang } from "./copy";
import { knowledgeFileSlug } from "./knowledge-export";
import type { ReviewState } from "./types";

type DraftRow = {
  id: string;
  store_url: string;
  store_name: string;
  scanned_at: string | null;
  saved_at: string | Date;
  pages: number;
  demo: boolean | null;
  lang?: string;
  payload?: unknown;
  public_slug?: string | null;
};

export type PublicDraftRow = {
  storeName: string;
  storeUrl: string;
  savedAt: string;
  lang: ClarityLang;
  payload: unknown;
};

function iso(value: string | Date | null | undefined) {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function metaFromRow(row: DraftRow): ClarityDraftMeta {
  return {
    id: row.id,
    storeUrl: row.store_url,
    storeName: row.store_name,
    savedAt: iso(row.saved_at),
    scannedAt: row.scanned_at || iso(row.saved_at),
    pages: Number(row.pages) || 0,
    demo: Boolean(row.demo),
  };
}

export async function upsertClarityUser(user: {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}) {
  await ensureClaritySchema();
  const db = sql();
  await db`
    INSERT INTO clarity_users (id, email, name, image, updated_at)
    VALUES (${user.id}, ${user.email || null}, ${user.name || null}, ${user.image || null}, now())
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      image = EXCLUDED.image,
      updated_at = now()
  `;
}

export async function listClarityDrafts(userId: string): Promise<ClarityDraftMeta[]> {
  await ensureClaritySchema();
  const db = sql();
  const rows = (await db`
    SELECT id, store_url, store_name, scanned_at, saved_at, pages, demo
    FROM clarity_drafts
    WHERE user_id = ${userId} AND deleted_at IS NULL
    ORDER BY saved_at DESC
  `) as DraftRow[];
  return rows.map(metaFromRow);
}

export async function getClarityDraft(userId: string, id: string): Promise<ClarityDraft | null> {
  await ensureClaritySchema();
  const db = sql();
  const rows = (await db`
    SELECT id, store_url, store_name, scanned_at, saved_at, pages, demo, lang, payload
    FROM clarity_drafts
    WHERE user_id = ${userId} AND id = ${id} AND deleted_at IS NULL
    LIMIT 1
  `) as DraftRow[];
  const row = rows[0];
  if (!row) return null;
  const parsed =
    typeof row.payload === "string"
      ? parseDraftFile(row.payload)
      : parseDraftFile(JSON.stringify(row.payload));
  if (!parsed) return null;
  return {
    ...parsed,
    id: row.id,
    savedAt: iso(row.saved_at),
    lang: parsed.lang,
  };
}

export async function saveClarityDraft(userId: string, draft: ClarityDraft): Promise<ClarityDraft> {
  await ensureClaritySchema();
  const db = sql();
  const savedAt = new Date().toISOString();
  const next: ClarityDraft = { ...draft, savedAt };
  const payload = JSON.stringify({
    id: next.id,
    savedAt: next.savedAt,
    lang: next.lang,
    result: next.result,
    state: next.state,
  });
  const publicSlug = knowledgeFileSlug(next.result.storeName);
  await db`
    INSERT INTO clarity_drafts (
      id, user_id, store_url, store_name, scanned_at, saved_at, pages, demo, lang, payload, public_slug
    )
    VALUES (
      ${next.id},
      ${userId},
      ${next.result.storeUrl},
      ${next.result.storeName},
      ${next.result.scannedAt},
      ${savedAt}::timestamptz,
      ${next.result.pagesScanned.length},
      ${Boolean(next.result.demo)},
      ${next.lang},
      ${payload}::jsonb,
      CASE
        WHEN EXISTS (
          SELECT 1 FROM clarity_drafts d
          WHERE d.public_slug = ${publicSlug}
            AND d.deleted_at IS NULL
            AND NOT (d.user_id = ${userId} AND d.id = ${next.id})
        ) THEN NULL
        ELSE ${publicSlug}
      END
    )
    ON CONFLICT (user_id, id) DO UPDATE SET
      store_url = EXCLUDED.store_url,
      store_name = EXCLUDED.store_name,
      scanned_at = EXCLUDED.scanned_at,
      saved_at = EXCLUDED.saved_at,
      pages = EXCLUDED.pages,
      demo = EXCLUDED.demo,
      lang = EXCLUDED.lang,
      payload = EXCLUDED.payload,
      public_slug = COALESCE(clarity_drafts.public_slug, EXCLUDED.public_slug),
      deleted_at = NULL
  `;
  return next;
}

export async function patchClarityDraftState(
  userId: string,
  id: string,
  state: ReviewState,
  lang: ClarityLang,
) {
  await ensureClaritySchema();
  const db = sql();
  const savedAt = new Date().toISOString();
  const stateJson = JSON.stringify(state);
  const rows = (await db`
    UPDATE clarity_drafts
    SET
      payload = jsonb_set(payload, '{state}', ${stateJson}::jsonb, true),
      lang = ${lang},
      saved_at = ${savedAt}::timestamptz
    WHERE user_id = ${userId} AND id = ${id}
    RETURNING id
  `) as { id: string }[];
  return rows[0] ? { id, savedAt, lang } : null;
}

export async function deleteClarityDraft(userId: string, id: string) {
  await ensureClaritySchema();
  const db = sql();
  await db`
    UPDATE clarity_drafts
    SET deleted_at = now()
    WHERE user_id = ${userId} AND id = ${id} AND deleted_at IS NULL
  `;
}

function publicRow(row: DraftRow): PublicDraftRow {
  return {
    storeName: row.store_name,
    storeUrl: row.store_url,
    savedAt: iso(row.saved_at),
    lang: row.lang === "en" ? "en" : "he",
    payload: row.payload,
  };
}

export async function findPublicClarityDraft(options: {
  slug: string;
  aliases?: string[];
  hosts?: string[];
}): Promise<PublicDraftRow | null> {
  await ensureClaritySchema();
  const db = sql();
  const slug = options.slug;
  const aliases = [...new Set([slug, ...(options.aliases || [])])];
  const rows = (await db`
    SELECT store_url, store_name, saved_at, lang, payload, public_slug
    FROM clarity_drafts
    WHERE deleted_at IS NULL
      AND COALESCE(demo, false) = false
      AND (
        public_slug = ${slug}
        OR replace(lower(trim(store_name)), ' ', '-') = ${slug}
      )
    ORDER BY saved_at DESC
    LIMIT 1
  `) as DraftRow[];
  if (rows[0]) return publicRow(rows[0]);

  for (const alias of aliases) {
    if (alias === slug) continue;
    const aliasRows = (await db`
      SELECT store_url, store_name, saved_at, lang, payload, public_slug
      FROM clarity_drafts
      WHERE deleted_at IS NULL
        AND COALESCE(demo, false) = false
        AND (
          public_slug = ${alias}
          OR replace(lower(trim(store_name)), ' ', '-') = ${alias}
        )
      ORDER BY saved_at DESC
      LIMIT 1
    `) as DraftRow[];
    if (aliasRows[0]) return publicRow(aliasRows[0]);
  }

  for (const host of options.hosts || []) {
    const hostRows = (await db`
      SELECT store_url, store_name, saved_at, lang, payload, public_slug
      FROM clarity_drafts
      WHERE deleted_at IS NULL
        AND COALESCE(demo, false) = false
        AND store_url ILIKE ${`%${host}%`}
      ORDER BY saved_at DESC
      LIMIT 1
    `) as DraftRow[];
    if (hostRows[0]) return publicRow(hostRows[0]);
  }

  return null;
}
