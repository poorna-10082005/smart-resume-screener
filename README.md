
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
