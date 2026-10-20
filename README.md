# Maria Hertogh: You Are the Judge

Student game: `Judge Game.dc.html` · Teacher view: `Teacher Dashboard.dc.html` · Content: `game-data.js`

## Set up (about 20 minutes, once)

**1. Tracking sheet (free)**
1. Create a Google Sheet. Extensions → Apps Script. Paste `apps-script.gs`. Save.
2. Deploy → New deployment → Web app. Execute as **Me**, access **Anyone**. Copy the URL.
3. Paste it into `SHEET_URL` in `game-api.js`.

**2. Host on Vercel (free)**
1. Download this project and upload the folder to a GitHub repo (or use `vercel` CLI).
2. Import the repo at vercel.com → New Project. No build settings needed.
3. Project → Settings → Environment Variables → add `ANTHROPIC_API_KEY` (from console.anthropic.com). Redeploy.
4. Student link: `https://your-project.vercel.app/` · Teacher link: `https://your-project.vercel.app/teacher`

Cost: Claude Haiku, roughly a few US cents per student per lesson. Set a monthly spend limit in the Anthropic console.

**3. Put it in SLS**
In your SLS lesson, add a Website/Embed component with the student link (or an iframe: `<iframe src="https://your-project.vercel.app/" width="100%" height="900"></iframe>`). Keep the teacher link to yourself.

## Editing content
All characters, sources, history and sentence starters are in `game-data.js`. Sources are adapted paraphrases for Sec 2; swap in your own extracts as needed.

## Teacher preview
Add `?teacher=1` to the student link (e.g. `https://your-project.vercel.app/?teacher=1`) to open every step without filling anything in. Nothing is saved to the sheet in this mode. In the editor, the same switch is in Tweaks → Teacher preview.

## Archival photos
The game has three photo frames (login, case file, aftermath). In the editor, drag a photo onto each frame. Good sources: NLB Infopedia and the National Archives of Singapore (PictureSG / Archives Online). Check the usage terms and keep the credit in the caption.

## Privacy
Students enter only a name and class. Logs go to your own Google Sheet. The teacher link has no password; don't share it.
