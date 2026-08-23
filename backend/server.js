/**
 * Smart Resume Screener — Backend
 * ---------------------------------
 * A small Express API that compares a resume against a job description
 * and returns a match score, matched skills, missing skills, and tips.
 *
 * Run:
 *   cd backend
 *   npm install
 *   npm start        (starts on http://localhost:5000)
 */

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// ---------------------------------------------------------------------------
// A reference dictionary of common skills / tools / keywords the screener
// knows how to recognize. Feel free to extend this list for your own domain.
// ---------------------------------------------------------------------------
const SKILL_DICTIONARY = [
  // Programming languages
  "javascript", "typescript", "python", "java", "c++", "c#", "go", "golang",
  "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "sql", "html", "css",
  // Frameworks / libraries
  "react", "angular", "vue", "next.js", "nodejs", "node.js", "express",
  "django", "flask", "spring", "spring boot", "laravel", "tensorflow",
  "pytorch", "keras", "pandas", "numpy", "bootstrap", "tailwind", "redux",
  // Databases
  "mysql", "postgresql", "mongodb", "sqlite", "redis", "oracle", "firebase",
  "dynamodb", "elasticsearch",
  // Cloud / DevOps
  "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "jenkins",
  "ci/cd", "terraform", "ansible", "linux", "git", "github", "gitlab",
  // Data / AI
  "machine learning", "deep learning", "nlp", "data analysis",
  "data science", "artificial intelligence", "computer vision",
  "big data", "hadoop", "spark", "power bi", "tableau", "excel",
  // Soft / business skills
  "communication", "leadership", "teamwork", "problem solving",
  "project management", "agile", "scrum", "time management",
  "critical thinking", "collaboration", "adaptability", "creativity",
  // Other common resume terms
  "rest api", "graphql", "microservices", "unit testing", "testing",
  "figma", "ui/ux", "seo", "product management", "stakeholder management",
];

// Common English stopwords to ignore while extracting keywords from free text
const STOPWORDS = new Set([
  "a","an","the","and","or","but","if","then","so","of","in","on","at","for",
  "to","with","by","from","as","is","are","was","were","be","been","being",
  "this","that","these","those","it","its","we","you","your","our","they",
  "their","he","she","his","her","i","me","my","will","would","can","could",
  "should","must","have","has","had","do","does","did","not","no","yes",
  "about","into","over","under","than","also","such","who","whom","which",
  "what","when","where","why","how","all","any","each","other","some",
  "more","most","only","own","same","than","too","very","just","up","down",
  "out","off","again","further","once","years","year","experience",
  "responsibilities","requirements","role","job","work","working",
]);

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s]/g, " ") // keep letters/numbers and a few tech symbols like c++, c#, ci/cd
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text) {
  const clean = normalize(text);
  const words = clean.split(" ").filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return new Set(words);
}

function findSkillsInText(text) {
  const clean = ` ${normalize(text)} `;
  return SKILL_DICTIONARY.filter((skill) => clean.includes(` ${skill} `));
}

/**
 * Core scoring logic.
 * 1. Detect known skills mentioned in the job description.
 * 2. Check how many of those skills also appear in the resume.
 * 3. Blend that with a general keyword-overlap score for a fuller picture.
 */
function screenResume(resumeText, jobDescription) {
  const jdSkills = findSkillsInText(jobDescription);
  const resumeSkills = new Set(findSkillsInText(resumeText));

  const matchedSkills = jdSkills.filter((s) => resumeSkills.has(s));
  const missingSkills = jdSkills.filter((s) => !resumeSkills.has(s));

  const skillScore = jdSkills.length
    ? (matchedSkills.length / jdSkills.length) * 100
    : null;

  // General keyword overlap (fallback / supplementary signal)
  const jdKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resumeText);
  let overlapCount = 0;
  jdKeywords.forEach((k) => {
    if (resumeKeywords.has(k)) overlapCount += 1;
  });
  const keywordScore = jdKeywords.size
    ? (overlapCount / jdKeywords.size) * 100
    : 0;

  // Final score: weight the curated skill match higher when we have skills,
  // otherwise fall back fully to general keyword overlap.
  const finalScore =
    skillScore !== null ? skillScore * 0.7 + keywordScore * 0.3 : keywordScore;

  const tips = [];
  if (missingSkills.length > 0) {
    tips.push(
      `Consider adding evidence of: ${missingSkills.slice(0, 8).join(", ")}.`
    );
  }
  if (finalScore < 50) {
    tips.push(
      "This resume has low overlap with the job description — tailor it with more relevant keywords."
    );
  } else if (finalScore < 75) {
    tips.push(
      "Decent match. Strengthen the resume by mirroring a few more exact terms from the job description."
    );
  } else {
    tips.push("Strong match with the job description.");
  }

  return {
    score: Math.round(finalScore),
    matchedSkills,
    missingSkills,
    jdSkillsDetected: jdSkills,
    tips,
  };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.json({
    message: "Smart Resume Screener API is running.",
    endpoints: ["/api/health", "POST /api/screen"],
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/screen", (req, res) => {
  const { resumeText, jobDescription } = req.body || {};

  if (!resumeText || !jobDescription) {
    return res.status(400).json({
      error: "Both 'resumeText' and 'jobDescription' fields are required.",
    });
  }

  try {
    const result = screenResume(resumeText, jobDescription);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong while screening the resume." });
  }
});

app.listen(PORT, () => {
  console.log(`Smart Resume Screener backend running at http://localhost:${PORT}`);
});
