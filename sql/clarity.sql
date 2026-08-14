CREATE TABLE IF NOT EXISTS clarity_users (
  id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clarity_drafts (
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
);

CREATE INDEX IF NOT EXISTS clarity_drafts_user_saved_idx
  ON clarity_drafts (user_id, saved_at DESC);

ALTER TABLE clarity_drafts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS clarity_drafts_user_active_idx
  ON clarity_drafts (user_id, saved_at DESC)
  WHERE deleted_at IS NULL;

ALTER TABLE clarity_users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE clarity_users ADD COLUMN IF NOT EXISTS password_hash TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS clarity_users_username_idx
  ON clarity_users (username) WHERE username IS NOT NULL;
