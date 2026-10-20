// Chat + logging helpers. Teachers: paste your Google Apps Script Web App URL below.
window.MH_CONFIG = window.MH_CONFIG || {
  SHEET_URL: "", // e.g. "https://script.google.com/macros/s/AKfy.../exec"
  MODEL: "claude-haiku-4-5"
};

window.MH_API = (function () {
  const RULES = "\n\nRULES: Stay fully in character. It is late November 1950; you do not know the verdict or the riots that come later. The person asking is the JUDGE (a Secondary 2 student in Singapore). Reply in simple, fully grammatical English a 13-year-old can read (an occasional Malay or Dutch word is fine, but never broken or pidgin English and no imitated accents). No stage directions, no asterisk actions, no narration — only your spoken words. Use at most 70 words in 2–4 short sentences. Give your side clearly, including real facts from your perspective, so the judge can use them as evidence. Be respectful. If asked something off-topic or inappropriate, politely steer back to the case. Never describe violence graphically.";

  async function complete(body) {
    if (window.claude && window.claude.complete) {
      return await window.claude.complete(body);
    }
    const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error("Chat server error " + r.status);
    const j = await r.json();
    return j.text;
  }

  async function chat(character, history) {
    return complete({
      model: window.MH_CONFIG.MODEL,
      max_tokens: 300,
      system: character.persona + RULES,
      messages: history.map(m => ({ role: m.from === "judge" ? "user" : "assistant", content: m.text }))
    });
  }

  async function critique(work) {
    const prompt = "You are a kind, encouraging Secondary 2 History teacher in Singapore. A student role-played the judge in the 1950 Maria Hertogh custody case. Learning objectives: historical empathy, cause and effect, use of evidence. Success criteria: (1) uses relevant evidence to support the custody decision; (2) identifies reasons that led to the conflict escalating into the December 1950 riots; (3) identifies potential negative implications of their verdict.\n\nStudent's work (JSON):\n" + JSON.stringify(work) +
      "\n\nReturn ONLY valid JSON, no markdown: {\"scores\":{\"evidence\":1-3,\"causes\":1-3,\"implications\":1-3,\"empathy\":1-3},\"did\":{\"evidence\":\"...\",\"causes\":\"...\",\"implications\":\"...\",\"empathy\":\"...\"},\"tip\":{\"evidence\":\"...\",\"causes\":\"...\",\"implications\":\"...\",\"empathy\":\"...\"},\"summary\":\"...\"}. 1=beginning, 2=developing, 3=secure. VERY SHORT: each 'did' and 'tip' at most 10 words, plain words, no semicolons. 'did' = one thing they did (or 'Not yet'). 'tip' = one concrete next step, start with a verb. 'summary' = one encouraging sentence, at most 12 words. Name sources by ID (S1..S8) or witnesses where useful.";
    const text = await complete({ model: window.MH_CONFIG.MODEL, max_tokens: 700, messages: [{ role: "user", content: prompt }] });
    const m = text.match(/\{[\s\S]*\}/);
    let c;
    try { c = JSON.parse(m ? m[0] : text); } catch (e) { c = JSON.parse((m ? m[0] : text).replace(/\\"/g, '"')); }
    c.next = c.next || Object.values(c.tip || {});
    return c;
  }

  function log(student, type, data) {
    const entry = { ts: new Date().toISOString(), student: student.name, cls: student.cls, sid: student.sid, type, data };
    try {
      const all = JSON.parse(localStorage.getItem("mh_logs") || "[]");
      all.push(entry);
      localStorage.setItem("mh_logs", JSON.stringify(all.slice(-3000)));
    } catch (e) {}
    const url = window.MH_CONFIG.SHEET_URL;
    if (url) {
      fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(entry) }).catch(() => {});
    }
  }

  async function fetchLogs() {
    const url = window.MH_CONFIG.SHEET_URL;
    if (url) {
      const r = await fetch(url + (url.includes("?") ? "&" : "?") + "action=list");
      return await r.json();
    }
    return JSON.parse(localStorage.getItem("mh_logs") || "[]");
  }

  return { chat, critique, log, fetchLogs };
})();
