import type { ClarityDraft, ClarityDraftMeta } from "./draft";
import { ensureClaritySchema, sql } from "./db";
import { draftIdFor, parseDraftFile, slimDraft } from "./draft";
import type { ClarityLang } from "./copy";
import { knowledgeFileSlug } from "./knowledge-export";
import type { ReviewState } from "./types";
import {
  canonicalClarityUserId,
  isPasswordUserId,
  normalizeAccountEmail,
  ownerIdCandidates,
  type ClarityAccount,
} from "./identity";

export type { ClarityAccount };

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

function accountEmail(email?: string | null) {
  return normalizeAccountEmail(email);
}

async function ownerUserIds(account: ClarityAccount) {
  const ids = new Set<string>(ownerIdCandidates(account));
  const email = accountEmail(account.email);
  if (!email) return [...ids];
  const db = sql();
  const userRows = (await db`
    SELECT id FROM clarity_users
    WHERE lower(coalesce(email, '')) = ${email}
  `) as { id: string }[];
  for (const row of userRows) {
    if (!isPasswordUserId(row.id) || isPasswordUserId(canonicalClarityUserId(account))) {
      ids.add(row.id);
    }
  }
  return [...ids].filter(Boolean);
}

async function draftsForOwners(ownerIds: string[], email?: string) {
  const db = sql();
  const found: DraftRow[] = [];
  if (email) {
    const rows = (await db`
      SELECT d.id, d.store_url, d.store_name, d.scanned_at, d.saved_at, d.pages, d.demo, d.lang
      FROM clarity_drafts d
      INNER JOIN clarity_users u ON u.id = d.user_id
      WHERE d.deleted_at IS NULL AND lower(coalesce(u.email, '')) = ${email}
      ORDER BY d.saved_at DESC
    `) as DraftRow[];
    found.push(...rows);
  }
  for (const ownerId of ownerIds) {
    const rows = (await db`
      SELECT id, store_url, store_name, scanned_at, saved_at, pages, demo, lang
      FROM clarity_drafts
      WHERE user_id = ${ownerId} AND deleted_at IS NULL
      ORDER BY saved_at DESC
    `) as DraftRow[];
    found.push(...rows);
  }
  const latest = new Map<string, DraftRow>();
  for (const row of found) {
    const current = latest.get(row.id);
    if (!current || iso(row.saved_at) > iso(current.saved_at)) latest.set(row.id, row);
  }
  return [...latest.values()].sort((a, b) => (iso(a.saved_at) < iso(b.saved_at) ? 1 : -1));
}

async function adoptDraftsToCanonical(canonicalId: string, aliasIds: string[], email?: string | null) {
  if (!canonicalId) return;
  if (canonicalId.startsWith("google:") && !canonicalId.includes("@")) return;
  const ownerEmail = accountEmail(email);
  const db = sql();
  for (const aliasId of aliasIds) {
    if (!aliasId || aliasId === canonicalId) continue;
    if (isPasswordUserId(aliasId) && !isPasswordUserId(canonicalId)) continue;

    try {
      const users = (await db`
        SELECT id, email FROM clarity_users WHERE id = ${aliasId} LIMIT 1
      `) as { id: string; email: string | null }[];
      const alias = users[0];
      if (alias) {
        const aliasEmail = accountEmail(alias.email);
        if (aliasEmail && ownerEmail && aliasEmail !== ownerEmail) continue;
        if (aliasEmail && !ownerEmail) continue;
        await db`
          INSERT INTO clarity_users (id, email, name, image, updated_at)
          SELECT ${canonicalId}, email, name, image, now()
          FROM clarity_users
          WHERE id = ${aliasId}
          ON CONFLICT (id) DO UPDATE SET
            email = COALESCE(NULLIF(EXCLUDED.email, ''), clarity_users.email),
            name = COALESCE(EXCLUDED.name, clarity_users.name),
            image = COALESCE(EXCLUDED.image, clarity_users.image),
            updated_at = now()
        `;
      }

      await db`
        INSERT INTO clarity_drafts (
          id, user_id, store_url, store_name, scanned_at, saved_at, pages, demo, lang, payload, deleted_at
        )
        SELECT
          id, ${canonicalId}, store_url, store_name, scanned_at, saved_at, pages, demo, lang, payload, deleted_at
        FROM clarity_drafts
        WHERE user_id = ${aliasId}
        ON CONFLICT (user_id, id) DO UPDATE SET
          store_url = EXCLUDED.store_url,
          store_name = EXCLUDED.store_name,
          scanned_at = EXCLUDED.scanned_at,
          saved_at = GREATEST(clarity_drafts.saved_at, EXCLUDED.saved_at),
          pages = EXCLUDED.pages,
          demo = EXCLUDED.demo,
          lang = EXCLUDED.lang,
          payload = CASE
            WHEN EXCLUDED.saved_at >= clarity_drafts.saved_at THEN EXCLUDED.payload
            ELSE clarity_drafts.payload
          END,
          deleted_at = CASE
            WHEN EXCLUDED.deleted_at IS NULL THEN NULL
            ELSE clarity_drafts.deleted_at
          END
      `;
      await db`DELETE FROM clarity_drafts WHERE user_id = ${aliasId}`;
      const leftover = (await db`
        SELECT id FROM clarity_drafts WHERE user_id = ${aliasId} LIMIT 1
      `) as { id: string }[];
      if (leftover[0] || !alias) continue;
      await db`DELETE FROM clarity_users WHERE id = ${aliasId}`;
    } catch {
      continue;
    }
  }
}

export async function upsertClarityUser(user: {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  googleSub?: string | null;
}) {
  await ensureClaritySchema();
  const db = sql();
  const canonicalId = canonicalClarityUserId(user);
  const email = accountEmail(user.email) || null;
  await db`
    INSERT INTO clarity_users (id, email, name, image, updated_at)
    VALUES (${canonicalId}, ${email}, ${user.name || null}, ${user.image || null}, now())
    ON CONFLICT (id) DO UPDATE SET
      email = COALESCE(NULLIF(EXCLUDED.email, ''), clarity_users.email),
      name = COALESCE(NULLIF(EXCLUDED.name, ''), clarity_users.name),
      image = COALESCE(EXCLUDED.image, clarity_users.image),
      updated_at = now()
  `;
  try {
    await adoptDraftsToCanonical(canonicalId, await ownerUserIds(user), email);
  } catch {
    // Listing still searches every alias if a copy fails.
  }
  return canonicalId;
}

export async function listClarityDrafts(account: ClarityAccount): Promise<ClarityDraftMeta[]> {
  await ensureClaritySchema();
  const rows = await draftsForOwners(await ownerUserIds(account), accountEmail(account.email));
  return rows.map(metaFromRow);
}

export async function getClarityDraft(account: ClarityAccount, id: string): Promise<ClarityDraft | null> {
  await ensureClaritySchema();
  const db = sql();
  const rawId = decodeURIComponent(id).trim();
  const host = draftIdFor(rawId.startsWith("http") ? rawId : `https://${rawId}`).replace(/^www\./i, "");
  const wanted = new Set([rawId, rawId.toLowerCase(), host, `www.${host}`].filter(Boolean));
  const ownerIds = await ownerUserIds(account);
  const rows = await draftsForOwners(ownerIds, accountEmail(account.email));
  const match =
    rows.find((item) => wanted.has(item.id) || wanted.has(item.id.toLowerCase())) ||
    rows.find((item) => {
      const itemHost = draftIdFor(item.store_url || item.id).replace(/^www\./i, "");
      return itemHost === host || item.id.replace(/^www\./i, "") === host;
    });
  if (!match) return null;
  const email = accountEmail(account.email);
  if (email) {
    const byEmail = (await db`
      SELECT d.id, d.store_url, d.store_name, d.scanned_at, d.saved_at, d.pages, d.demo, d.lang, d.payload
      FROM clarity_drafts d
      INNER JOIN clarity_users u ON u.id = d.user_id
      WHERE d.id = ${match.id}
        AND d.deleted_at IS NULL
        AND lower(coalesce(u.email, '')) = ${email}
      ORDER BY d.saved_at DESC
      LIMIT 1
    `) as DraftRow[];
    const parsed = byEmail[0] ? draftFromRow(byEmail[0]) : null;
    if (parsed) return slimDraft({ ...parsed, id: byEmail[0].id });
  }
  for (const ownerId of ownerIds) {
    const found = (await db`
      SELECT id, store_url, store_name, scanned_at, saved_at, pages, demo, lang, payload
      FROM clarity_drafts
      WHERE user_id = ${ownerId} AND id = ${match.id} AND deleted_at IS NULL
      LIMIT 1
    `) as DraftRow[];
    const row = found[0];
    if (!row) continue;
    const parsed = draftFromRow(row);
    if (parsed) return slimDraft({ ...parsed, id: row.id });
  }
  return null;
}

function draftFromRow(row: DraftRow): ClarityDraft | null {
  const raw = typeof row.payload === "string" ? row.payload : JSON.stringify(row.payload ?? {});
  const parsed = parseDraftFile(raw);
  if (parsed) {
    return {
      ...parsed,
      id: row.id,
      savedAt: iso(row.saved_at),
      lang: parsed.lang,
    };
  }
  try {
    const payload = (typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload) as {
      result?: ClarityDraft["result"];
      state?: ClarityDraft["state"];
      lang?: string;
    } | null;
    if (!payload?.result?.topics) return null;
    return {
      id: row.id,
      savedAt: iso(row.saved_at),
      lang: payload.lang === "en" || row.lang === "en" ? "en" : "he",
      result: payload.result,
      state: {
        storeUrl: payload.state?.storeUrl || payload.result.storeUrl,
        decisions: payload.state?.decisions || {},
        customQas: payload.state?.customQas || [],
        productReviews: payload.state?.productReviews,
      },
    };
  } catch {
    return null;
  }
}

export async function saveClarityDraft(account: ClarityAccount, draft: ClarityDraft): Promise<ClarityDraft> {
  await ensureClaritySchema();
  const db = sql();
  const userId = canonicalClarityUserId(account) || account.id;
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
  account: ClarityAccount,
  id: string,
  state: ReviewState,
  lang: ClarityLang,
) {
  await ensureClaritySchema();
  const db = sql();
  const savedAt = new Date().toISOString();
  const stateJson = JSON.stringify(state);
  for (const ownerId of await ownerUserIds(account)) {
    const rows = (await db`
      UPDATE clarity_drafts
      SET
        payload = jsonb_set(
          jsonb_set(payload, '{state}', ${stateJson}::jsonb, true),
          '{savedAt}',
          to_jsonb(${savedAt}::text),
          true
        ),
        lang = ${lang},
        saved_at = ${savedAt}::timestamptz
      WHERE user_id = ${ownerId} AND id = ${id}
      RETURNING id
    `) as { id: string }[];
    if (rows[0]) return { id, savedAt, lang };
  }
  return null;
}

export async function deleteClarityDraft(account: ClarityAccount, id: string) {
  await ensureClaritySchema();
  const db = sql();
  for (const ownerId of await ownerUserIds(account)) {
    await db`
      UPDATE clarity_drafts
      SET deleted_at = now()
      WHERE user_id = ${ownerId} AND id = ${id} AND deleted_at IS NULL
    `;
  }
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
