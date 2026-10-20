-- Optional: run this once in the Neon SQL Editor to see the tables straight away.
-- The app also creates them automatically the first time a student logs in.

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  sid TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  cls TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS responses (
  id BIGSERIAL PRIMARY KEY,
  sid TEXT NOT NULL,
  student TEXT NOT NULL,
  cls TEXT NOT NULL,
  witness TEXT NOT NULL,
  prompt TEXT NOT NULL,
  answer TEXT,
  own BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  student TEXT NOT NULL,
  cls TEXT NOT NULL,
  sid TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS events_sid_idx ON events (sid, ts);
CREATE INDEX IF NOT EXISTS responses_sid_idx ON responses (sid, created_at);
