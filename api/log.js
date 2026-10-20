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
    const data = JSON.stringify(d.data || {}).slice(0, 20000);
    const sql = db();
    await ensureTable(sql);
    await sql`INSERT INTO events (ts, student, cls, sid, type, data) VALUES (${d.ts ? new Date(d.ts) : new Date()}, ${student}, ${cls}, ${sid}, ${type}, ${data}::jsonb)`;
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Could not save" });
  }
}
