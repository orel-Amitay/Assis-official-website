import { neon } from "@neondatabase/serverless";
import { canonicalClarityUserId, isPasswordUserId } from "./identity";

type Sql = ReturnType<typeof neon>;

let client: Sql | null = null;
let schemaReady: Promise<void> | null = null;

export function databaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    ""
  );
}

export function sql() {
  const url = databaseUrl();
  if (!url) throw new Error("DATABASE_URL is missing");
  if (!client) client = neon(url);
  return client;
}

async function migrateGoogleIdentities(db: Sql) {
  const rows = (await db`
    SELECT id, email, name, image
    FROM clarity_users
    WHERE email IS NOT NULL
      AND email <> ''
      AND id NOT LIKE 'pass:%'
  `) as {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  }[];

  for (const row of rows) {
    try {
      if (isPasswordUserId(row.id)) continue;
      const nextId = canonicalClarityUserId({ id: row.id, email: row.email });
      if (!nextId || nextId === row.id) continue;
      await db`
        INSERT INTO clarity_users (id, email, name, image, updated_at)
        VALUES (${nextId}, ${row.email}, ${row.name}, ${row.image}, now())
        ON CONFLICT (id) DO UPDATE SET
          email = COALESCE(NULLIF(EXCLUDED.email, ''), clarity_users.email),
          name = COALESCE(EXCLUDED.name, clarity_users.name),
          image = COALESCE(EXCLUDED.image, clarity_users.image),
          updated_at = now()
      `;
      await db`
        INSERT INTO clarity_drafts (
          id, user_id, store_url, store_name, scanned_at, saved_at, pages, demo, lang, payload, deleted_at
        )
        SELECT
          id, ${nextId}, store_url, store_name, scanned_at, saved_at, pages, demo, lang, payload, deleted_at
        FROM clarity_drafts
        WHERE user_id = ${row.id}
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
      await db`DELETE FROM clarity_drafts WHERE user_id = ${row.id}`;
      const leftover = (await db`
        SELECT id FROM clarity_drafts WHERE user_id = ${row.id} LIMIT 1
      `) as { id: string }[];
      if (leftover[0]) continue;
      await db`DELETE FROM clarity_users WHERE id = ${row.id}`;
    } catch {
      continue;
    }
  }
}

export async function ensureClaritySchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const db = sql();
      await db`CREATE TABLE IF NOT EXISTS clarity_users (
        id TEXT PRIMARY KEY,
        email TEXT,
        name TEXT,
        image TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
      await db`CREATE TABLE IF NOT EXISTS clarity_drafts (
        id TEXT NOT NULL,
        user_id TEXT NOT NULL REFERENCES clarity_users(id) ON DELETE CASCADE,
        store_url TEXT NOT NULL,
        store_name TEXT NOT NULL,
        scanned_at TEXT,
        saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        pages INTEGER NOT NULL DEFAULT 0,
        demo BOOLEAN NOT NULL DEFAULT false,
        lang TEXT NOT NULL DEFAULT 'he',
        payload JSONB NOT NULL,
        PRIMARY KEY (user_id, id)
      )`;
      await db`CREATE INDEX IF NOT EXISTS clarity_drafts_user_saved_idx
        ON clarity_drafts (user_id, saved_at DESC)`;
      await db`ALTER TABLE clarity_drafts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ`;
      await db`CREATE INDEX IF NOT EXISTS clarity_drafts_user_active_idx
        ON clarity_drafts (user_id, saved_at DESC)
        WHERE deleted_at IS NULL`;
      await db`ALTER TABLE clarity_users ADD COLUMN IF NOT EXISTS username TEXT`;
      await db`ALTER TABLE clarity_users ADD COLUMN IF NOT EXISTS password_hash TEXT`;
      await db`CREATE UNIQUE INDEX IF NOT EXISTS clarity_users_username_idx
        ON clarity_users (username) WHERE username IS NOT NULL`;
      try {
        await migrateGoogleIdentities(db);
      } catch {
        // Keep serving existing drafts even if identity copy fails.
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}
