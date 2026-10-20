import { neon } from "@neondatabase/serverless";

export function db() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error("No DATABASE_URL set");
  return neon(url);
}

export async function ensureTable(sql) {
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
}
