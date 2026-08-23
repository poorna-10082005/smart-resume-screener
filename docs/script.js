// ---------------------------------------------------------------------------
// Smart Resume Screener — frontend logic
// Talks to the backend API at API_BASE_URL and renders the scan results.
// ---------------------------------------------------------------------------

const API_BASE_URL = "https://smart-resume-backend-m8pk.onrender.com";

const jobDescriptionEl = document.getElementById("jobDescription");
const resumeTextEl = document.getElementById("resumeText");
const screenBtn = document.getElementById("screenBtn");
const sampleBtn = document.getElementById("sampleBtn");
const errorMsg = document.getElementById("errorMsg");

const idleState = document.getElementById("idleState");
const loadingState = document.getElementById("loadingState");
const resultsState = document.getElementById("resultsState");

const dialFill = document.getElementById("dialFill");
const scoreValue = document.getElementById("scoreValue");
const scoreVerdict = document.getElementById("scoreVerdict");
const matchedChips = document.getElementById("matchedChips");
const missingChips = document.getElementById("missingChips");
const tipsList = document.getElementById("tipsList");
const apiUrlLabel = document.getElementById("apiUrlLabel");

apiUrlLabel.textContent = API_BASE_URL;

const DIAL_CIRCUMFERENCE = 326.7; // 2 * π * r(52)

function setState(state) {
  idleState.hidden = state !== "idle";
  loadingState.hidden = state !== "loading";
  resultsState.hidden = state !== "results";
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.hidden = false;
}

function clearError() {
  errorMsg.hidden = true;
  errorMsg.textContent = "";
}

function renderChips(container, items, variant) {
  container.innerHTML = "";
  if (!items || items.length === 0) {
    const span = document.createElement("span");
    span.className = "chip empty";
    span.textContent = variant === "missing" ? "None — great coverage!" : "No matches found";
    container.appendChild(span);
    return;
  }
  items.forEach((skill) => {
    const span = document.createElement("span");
    span.className = variant === "missing" ? "chip missing" : "chip";
    span.textContent = skill;
    container.appendChild(span);
  });
}

function verdictForScore(score) {
  if (score >= 75) return "Strong match";
  if (score >= 50) return "Moderate match";
  return "Weak match";
}

function dialColorForScore(score) {
  if (score >= 75) return "#35c9a5"; // teal
  if (score >= 50) return "#ffb020"; // amber
  return "#ff6b5e"; // coral
}

function renderResults(data) {
  const score = Math.max(0, Math.min(100, data.score));

  scoreValue.textContent = score;
  scoreVerdict.textContent = verdictForScore(score);

  const offset = DIAL_CIRCUMFERENCE - (DIAL_CIRCUMFERENCE * score) / 100;
  dialFill.style.stroke = dialColorForScore(score);
  // reset then animate
  dialFill.style.transition = "none";
  dialFill.style.strokeDashoffset = DIAL_CIRCUMFERENCE;
  requestAnimationFrame(() => {
    dialFill.style.transition = "";
    dialFill.style.strokeDashoffset = offset;
  });

  renderChips(matchedChips, data.matchedSkills, "matched");
  renderChips(missingChips, data.missingSkills, "missing");

  tipsList.innerHTML = "";
  (data.tips || []).forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    tipsList.appendChild(li);
  });

  setState("results");
}

async function screenResume() {
  clearError();

  const jobDescription = jobDescriptionEl.value.trim();
  const resumeText = resumeTextEl.value.trim();

  if (!jobDescription || !resumeText) {
    showError("Please paste both a job description and resume text before scanning.");
    return;
  }

  setState("loading");
  screenBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/screen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.error || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    renderResults(data);
  } catch (err) {
    console.error(err);
    setState("idle");
    showError(
      `Couldn't reach the backend (${err.message}). Make sure the server is running at ${API_BASE_URL}.`
    );
  } finally {
    screenBtn.disabled = false;
  }
}

function loadSample() {
  jobDescriptionEl.value =
    "We're looking for a Frontend Engineer skilled in JavaScript, React, and CSS. " +
    "Experience with REST APIs, Git, and Agile teams required. Familiarity with Node.js, " +
    "testing, and cloud platforms like AWS is a plus. Strong communication and problem solving skills expected.";

  resumeTextEl.value =
    "Frontend developer with 4 years of experience building web apps using JavaScript, React, and Redux. " +
    "Comfortable with HTML, CSS, and REST API integration. Used Git for version control and worked in Agile " +
    "sprint teams. Some exposure to Node.js for small backend tasks. Known for strong communication and " +
    "collaboration with designers and product managers.";

  clearError();
}

screenBtn.addEventListener("click", screenResume);
sampleBtn.addEventListener("click", loadSample);
