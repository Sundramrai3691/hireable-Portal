const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, company, companyLogo, location, tags } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const tagsArr = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

    const job = new Job({
      title,
      company,
      companyLogo: typeof companyLogo === "string" ? companyLogo : null,
      location: location || "Remote",
      type: "Full-time",
      salary: "Not specified",
      description: "",
      tags: tagsArr,
      postedBy: req.user.id,
      isActive: true,
    });

    await job.save();

    res.status(201).json(job.toJSON());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { location, tag, type } = req.query;

    let query = { isActive: true };

    if (location && location !== "All") {
      query.location = { $regex: location, $options: "i" };
    }

    if (type && type !== "All") {
      query.type = type;
    }

    if (tag) {
      query.tags = tag;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/:id/apply", authMiddleware, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const existingApplication = await Application.findOne({
      user: userId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({ error: "Already applied to this job" });
    }

    const application = new Application({
      user: userId,
      job: jobId,
    });

    await application.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
