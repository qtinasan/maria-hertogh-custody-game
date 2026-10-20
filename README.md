# Maria Hertogh: You Are the Judge

Student game: `You are Justice T.A. Brown.dc.html` · Teacher view: `Teacher Dashboard.dc.html` · Content: `game-data.js`

## Set up (about 20 minutes, once)

**1. Host on Vercel (free)**
1. Upload this folder to a GitHub repo, then import it at vercel.com → New Project. No build settings needed.
2. Student link: `https://your-project.vercel.app/` · Teacher link: `https://your-project.vercel.app/teacher`

**2. Add the database (free tier)**
1. In your Vercel project: Storage → Create Database → Postgres (Neon) → Connect to this project.
2. This adds `DATABASE_URL` automatically. The `events` table is created on first use.

**3. Add the other settings**
Project → Settings → Environment Variables:
- `ANTHROPIC_API_KEY`: from console.anthropic.com. Set a monthly spend limit there.
- `TEACHER_PASSWORD`: any password you choose. The dashboard asks for it.

Redeploy after adding variables.

**4. Put it in SLS**
Add a Website/Embed component with the student link (or `<iframe src="https://your-project.vercel.app/" width="100%" height="900"></iframe>`). Keep the teacher link to yourself.

## How tracking works
Every login, step change, question, pinned evidence, verdict and feedback is saved to Postgres as it happens (`events` table: time, student, class, session id, type, data). `/teacher` reads it back every 15 seconds after you enter the password. To export, use the Neon console (SQL editor or CSV export).

## Editing content
All characters, sources, history and sentence starters are in `game-data.js`.

## Teacher preview
Add `?teacher=1` to the student link to open every step without filling anything in. Nothing is saved in this mode.

## Archival photos
Files are in `images/`. Replace a file with one of the same name to swap a photo. Check usage terms (NLB Infopedia, National Archives of Singapore) and keep the credit in the caption.

## Privacy
Students enter only a name and class. Data is stored in your own Vercel/Neon database. Delete it by dropping the `events` table.
