# Smart Resume Screener

A tool that compares a resume against a job description and returns a match score, matched skills, missing skills, and improvement tips — built with a Node/Express backend and a vanilla HTML/CSS/JS frontend.

## Live Demo

- **Frontend:** https://poorna-10082005.github.io/smart-resume-screener/
- **Backend API:** https://smart-resume-backend-m8pk.onrender.com

> Note: the backend runs on Render's free tier, which sleeps after inactivity. The first request after a while may take 20–50 seconds to wake up.

## How It Works

1. Paste a job description and a resume into the two text boxes.
2. Click **Scan resume**.
3. The backend checks the job description against a built-in dictionary of ~80 common skills (programming languages, frameworks, cloud tools, soft skills, etc.), then checks how many of those also appear in the resume.
4. It blends that skill-match score (70%) with a general keyword-overlap score (30%) to produce a final match percentage.
5. Results show: match score, matched skills, missing skills, and short improvement tips.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (no frameworks, no build step)
- **Backend:** Node.js, Express
- **Hosting:** GitHub Pages (frontend), Render (backend)
```
## Project Structure
smart-resume-screener/
├── backend/
│ ├── server.js
│ └── package.json
├── docs/ (frontend — served via GitHub Pages)
│ ├── index.html
│ ├── style.css
│ └── script.js
└── README.md
```
> The frontend folder is named `docs` because GitHub Pages only serves from `/root` or `/docs`.

## Running Locally

**Backend:**
```bash
cd backend
npm install
npm start
```
Runs at `http://localhost:5000`.

**Frontend:**
Open `docs/index.html` directly in a browser. Note it's pre-configured to call the live Render backend — to test against your local backend instead, temporarily change `API_BASE_URL` in `docs/script.js` to `http://localhost:5000`.

## API

**POST /api/screen**

Request body:
```json
{
  "resumeText": "...",
  "jobDescription": "..."
}
```

Response:
```json
{
  "score": 78,
  "matchedSkills": ["javascript", "react", "git"],
  "missingSkills": ["aws", "agile"],
  "tips": ["Consider adding evidence of: aws, agile."]
}
```

**GET /api/health** — returns `{ "status": "ok" }`, useful for checking the backend is awake.
