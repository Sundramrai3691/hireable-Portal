const express = require("express");
const natural = require("natural");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const tokenizer = new natural.WordTokenizer();

const TECH_KEYWORDS = [
  "react",
  "reactjs",
  "nextjs",
  "node",
  "nodejs",
  "express",
  "nestjs",
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "c++",
  "golang",
  "rust",
  "mongodb",
  "postgresql",
  "mysql",
  "redis",
  "sql",
  "nosql",
  "docker",
  "kubernetes",
  "aws",
  "gcp",
  "azure",
  "linux",
  "git",
  "rest api",
  "graphql",
  "microservices",
  "system design",
  "data structures",
  "algorithms",
  "dsa",
  "oop",
  "operating systems",
  "dbms",
  "computer networks",
  "jwt",
  "oauth",
  "authentication",
  "authorization",
  "socket.io",
  "websocket",
  "tailwind",
  "css",
  "html",
  "vite",
  "webpack",
  "testing",
  "jest",
  "cypress",
  "playwright",
  "machine learning",
  "deep learning",
  "tensorflow",
  "pytorch",
  "flask",
  "django",
  "fastapi",
  "spring boot",
  "kafka",
  "ci/cd",
  "agile",
  "scrum",
  "figma",
  "problem solving",
  "api",
];

const STOPWORDS = new Set(
  natural.stopwords.concat([
    "experience",
    "developer",
    "engineering",
    "engineer",
    "work",
    "team",
  ]),
);

function normalizeText(text = "") {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s/]/g, " ");
}

function countOccurrences(text, phrase) {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`\\b${escaped}\\b`, "g"));
  return match ? match.length : 0;
}

function extractImportantTerms(jobDescription) {
  const normalizedJD = normalizeText(jobDescription);
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(normalizedJD);

  const dictionaryMatches = TECH_KEYWORDS.filter((keyword) => normalizedJD.includes(keyword));
  const tfidfTerms = tfidf
    .listTerms(0)
    .filter((term) => term.term.length > 2 && !STOPWORDS.has(term.term))
    .slice(0, 20)
    .map((term) => term.term);

  return Array.from(new Set([...dictionaryMatches, ...tfidfTerms])).slice(0, 18);
}

function buildSuggestions(missingKeywords, normalizedJD) {
  return missingKeywords.slice(0, 3).map((keyword) => {
    const frequency = Math.max(1, countOccurrences(normalizedJD, keyword));
    return {
      keyword,
      frequency,
      tip: `Add evidence for ${keyword} in your projects, skills, or resume bullets because it appears ${frequency} time${frequency > 1 ? "s" : ""} in this JD.`,
    };
  });
}

router.post("/analyze", authMiddleware, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: "Both resumeText and jobDescription are required.",
      });
    }

    const normalizedResume = normalizeText(resumeText);
    const normalizedJD = normalizeText(jobDescription);
    const jdKeywords = extractImportantTerms(jobDescription);

    if (!jdKeywords.length) {
      return res.json({
        score: 0,
        matchedKeywords: [],
        missingKeywords: [],
        suggestions: [
          {
            keyword: "resume",
            frequency: 1,
            tip: "Paste a more detailed JD so PlaceMate can extract technical requirements accurately.",
          },
        ],
        totalJDKeywords: 0,
        matchedCount: 0,
      });
    }

    const matchedKeywords = jdKeywords.filter((keyword) => normalizedResume.includes(keyword));
    const missingKeywords = jdKeywords.filter((keyword) => !normalizedResume.includes(keyword));
    const score = Math.round((matchedKeywords.length / jdKeywords.length) * 100);

    res.json({
      score,
      matchedKeywords,
      missingKeywords,
      suggestions: buildSuggestions(missingKeywords, normalizedJD),
      totalJDKeywords: jdKeywords.length,
      matchedCount: matchedKeywords.length,
      tokensAnalyzed: {
        resume: tokenizer.tokenize(normalizedResume).length,
        jobDescription: tokenizer.tokenize(normalizedJD).length,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to analyze resume match." });
  }
});

module.exports = router;
