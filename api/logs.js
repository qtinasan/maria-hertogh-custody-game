import { db, ensureTable } from "./_db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });
  const key = process.env.TEACHER_PASSWORD;
  if (!key || req.headers["x-teacher-key"] !== key) return res.status(401).json({ error: "Wrong or missing teacher password" });
  try {
    const sql = db();
    await ensureTable(sql);
    const rows = await sql`SELECT ts, student, cls, sid, type, data FROM events ORDER BY ts ASC LIMIT 20000`;
    res.status(200).json(rows);
  } catch (e) {
    res.status(500).json({ error: "Could not load" });
  }
}
