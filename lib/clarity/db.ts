import { neon } from "@neondatabase/serverless";

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
      try {
        await db`CREATE UNIQUE INDEX IF NOT EXISTS clarity_users_username_idx
          ON clarity_users (username) WHERE username IS NOT NULL`;
      } catch {
        // Duplicate usernames should not block reading drafts.
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  return schemaReady;
}
