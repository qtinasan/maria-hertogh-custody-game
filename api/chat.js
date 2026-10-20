// Vercel serverless function: proxies chat to Anthropic so students need no account.
// Set ANTHROPIC_API_KEY in Vercel → Project → Settings → Environment Variables.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { system, messages, max_tokens } = req.body || {};
  if (!Array.isArray(messages) || messages.length > 40) return res.status(400).json({ error: "Bad request" });
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: "claude-haiku-4-5", max_tokens: Math.min(max_tokens || 300, 800), system, messages })
  });
  const j = await r.json();
  if (!r.ok) return res.status(500).json({ error: j.error?.message || "Upstream error" });
  res.status(200).json({ text: (j.content || []).map(c => c.text || "").join("") });
}
