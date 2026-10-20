// Google Apps Script backend for student tracking.
// 1. Create a Google Sheet → Extensions → Apps Script → paste this file → Save.
// 2. Deploy → New deployment → Web app → Execute as: Me · Who has access: Anyone → Deploy.
// 3. Copy the Web app URL into SHEET_URL in game-api.js.
const SHEET = "Logs";

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) { sh = ss.insertSheet(SHEET); sh.appendRow(["ts", "student", "cls", "sid", "type", "data"]); }
  return sh;
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  sheet_().appendRow([d.ts, d.student, d.cls, d.sid, d.type, JSON.stringify(d.data || {})]);
  return ContentService.createTextOutput("ok");
}

function doGet() {
  const rows = sheet_().getDataRange().getValues();
  const head = rows.shift();
  const out = rows.map(r => Object.fromEntries(head.map((h, i) => [h, r[i] instanceof Date ? r[i].toISOString() : r[i]])));
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
