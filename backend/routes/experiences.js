const express = require("express");
const authMiddleware = require("../middleware/auth");
const Experience = require("../models/Experience");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { company, role, year, outcome, topic, search } = req.query;
    const filter = {};

    if (company) {
      filter.companyName = new RegExp(company, "i");
    }
    if (role) {
      filter.role = new RegExp(role, "i");
    }
    if (year) {
      filter.year = Number(year);
    }
    if (outcome) {
      filter.outcome = outcome;
    }
    if (topic) {
      filter.topicsAsked = topic;
    }
    if (search) {
      filter.$or = [
        { companyName: new RegExp(search, "i") },
        { role: new RegExp(search, "i") },
        { tips: new RegExp(search, "i") },
      ];
    }

    const experiences = await Experience.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json(experiences.map((item) => item.toJSON()));
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch experiences." });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      companyName,
      role,
      year,
      month,
      branch,
      college,
      outcome,
      rounds,
      topicsAsked,
      tips,
      isAnonymous,
    } = req.body;

    if (!companyName || !role || !year || !month || !branch || !college) {
      return res.status(400).json({ error: "Please complete all required experience fields." });
    }

    const experience = new Experience({
      userId: isAnonymous ? null : req.user.id,
      companyName,
      role,
      year: Number(year),
      month,
      branch,
      college,
      outcome: outcome || "pending",
      rounds: Array.isArray(rounds) ? rounds.filter((round) => round.roundType && round.description) : [],
      topicsAsked: Array.isArray(topicsAsked) ? topicsAsked : [],
      tips: tips || "",
      isAnonymous: Boolean(isAnonymous),
    });

    await experience.save();
    res.status(201).json(experience.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to submit experience." });
  }
});

router.post("/:id/upvote", authMiddleware, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true },
    );

    if (!experience) {
      return res.status(404).json({ error: "Experience not found." });
    }

    res.json(experience.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to upvote experience." });
  }
});

module.exports = router;
