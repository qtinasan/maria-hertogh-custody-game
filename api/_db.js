import { neon } from "@neondatabase/serverless";

export function db() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("No DATABASE_URL set");
  return neon(url);
}

let ready = false;
export async function ensureTable(sql) {
  if (ready) return;
  await sql`CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    sid TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    cls TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS responses (
    id BIGSERIAL PRIMARY KEY,
    sid TEXT NOT NULL,
    student TEXT NOT NULL,
    cls TEXT NOT NULL,
    witness TEXT NOT NULL,
    prompt TEXT NOT NULL,
    answer TEXT,
    own BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    ts TIMESTAMPTZ NOT NULL DEFAULT now(),
    student TEXT NOT NULL,
    cls TEXT NOT NULL,
    sid TEXT NOT NULL,
    type TEXT NOT NULL,
    data JSONB NOT NULL DEFAULT '{}'::jsonb
  )`;
  await sql`CREATE INDEX IF NOT EXISTS events_sid_idx ON events (sid, ts)`;
  await sql`CREATE INDEX IF NOT EXISTS responses_sid_idx ON responses (sid, created_at)`;
  ready = true;
}
