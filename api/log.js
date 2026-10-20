import { db, ensureTable } from "./_db.js";

const TYPES = ["login", "stage", "chat", "pin", "unpin", "verdict", "critique"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const d = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const student = String(d.student || "").slice(0, 60).trim();
    const cls = String(d.cls || "").slice(0, 20).trim();
    const sid = String(d.sid || "").slice(0, 20).trim();
    const type = String(d.type || "");
    if (!student || !cls || !sid || !TYPES.includes(type)) return res.status(400).json({ error: "Bad entry" });
    const payload = d.data || {};
    const ts = d.ts ? new Date(d.ts) : new Date();
    const sql = db();
    await ensureTable(sql);

    await sql`INSERT INTO users (sid, name, cls, created_at, last_seen) VALUES (${sid}, ${student}, ${cls}, ${ts}, ${ts})
      ON CONFLICT (sid) DO UPDATE SET last_seen = EXCLUDED.last_seen, name = EXCLUDED.name, cls = EXCLUDED.cls`;

    if (type === "chat") {
      await sql`INSERT INTO responses (sid, student, cls, witness, prompt, answer, own, created_at)
        VALUES (${sid}, ${student}, ${cls}, ${String(payload.witness || "").slice(0, 80)}, ${String(payload.question || "").slice(0, 2000)}, ${String(payload.answer || "").slice(0, 4000)}, ${!!payload.own}, ${ts})`;
    }

    await sql`INSERT INTO events (ts, student, cls, sid, type, data) VALUES (${ts}, ${student}, ${cls}, ${sid}, ${type}, ${JSON.stringify(payload).slice(0, 20000)}::jsonb)`;
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not save" });
  }
}
