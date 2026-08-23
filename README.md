# Smart Resume Screener

A resume-vs-job-description match scorer with a Node/Express backend and a
plain HTML/CSS/JS frontend.

- **Backend (already deployed):** https://smart-resume-backend-1-asn8.onrender.com
- **Frontend:** in the `frontend/` folder — deploy with GitHub Pages (steps below).

---

## 1. Push this whole project to GitHub

Open a terminal in this folder (the one containing `backend/`, `frontend/`,
this `README.md`, and `.gitignore`) and run:

```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME/YOUR_REPO_NAME` with your actual GitHub repo URL
(create the repo first on github.com if you haven't).

---

## 2. Deploy the frontend with GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages**.
2. Under "Source", choose branch `main` and folder **`/frontend`**.
   (If `/frontend` isn't offered as an option, see the workaround below.)
3. Click **Save**. Wait 1–2 minutes, then GitHub will show you a live URL like:
   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### If GitHub Pages won't let you pick `/frontend`
Some accounts only offer `/ (root)` or `/docs`. If that happens, do one of:
- Rename the `frontend` folder to `docs`, push again, then select `/docs`, **or**
- Move `index.html`, `style.css`, and `script.js` up to the repo root, push
  again, then select `/ (root)`.

---

## 3. Backend (already live — for reference only)

The backend is already deployed at:
`https://smart-resume-backend-1-asn8.onrender.com`

If you ever redeploy it to a **different** Render URL, update this one line
in `frontend/script.js` and push again:

```js
const API_BASE_URL = "https://YOUR-NEW-RENDER-URL.onrender.com";
```

Render's free tier sleeps after inactivity — the first request after a
while can take 20–50 seconds to wake up. That's normal.

---

## 4. Test the live site

Open your GitHub Pages URL, click **Load sample**, then **Scan resume**.
Results should come back from the live Render backend.

---

## Local development (optional)

**Backend:**
```
cd backend
npm install
npm start
```
Runs at `http://localhost:5000`.

**Frontend:** just open `frontend/index.html` in a browser — but note it's
currently pointed at the *live* Render backend, not localhost. To test
against your local backend instead, temporarily change `API_BASE_URL` in
`frontend/script.js` to `http://localhost:5000`.
