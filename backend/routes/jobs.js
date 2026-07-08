const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/auth");
const { buildDateCursorPageQuery, buildPage } = require("../utils/cursorPagination");

const router = express.Router();

function parseList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      company,
      companyLogo,
      location,
      type,
      salary,
      description,
      tags,
      skills,
      eligibleBranches,
      minCGPA,
      typicalRounds,
      ctcRange,
      driveType,
      expectedDriveMonth,
      allowsAllBranches,
      hasBond,
      bondDetails,
      historicallyVisited,
      topicsAsked,
      difficulty,
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({ error: "Title and company are required" });
    }

    const job = new Job({
      title,
      company,
      companyLogo: typeof companyLogo === "string" ? companyLogo : null,
      location: location || "Remote",
      type: type || "Full-time",
      salary: salary || "Not specified",
      description: description || "",
      tags: parseList(tags || skills),
      eligibleBranches: parseList(eligibleBranches),
      minCGPA: Number(minCGPA || 0),
      typicalRounds: parseList(typicalRounds),
      ctcRange: {
        min: Number(ctcRange?.min || 0),
        max: Number(ctcRange?.max || 0),
      },
      driveType: driveType || "on-campus",
      expectedDriveMonth: expectedDriveMonth || "",
      allowsAllBranches: Boolean(allowsAllBranches),
      hasBond: Boolean(hasBond),
      bondDetails: bondDetails || "",
      historicallyVisited:
        historicallyVisited === undefined ? true : Boolean(historicallyVisited),
      topicsAsked: parseList(topicsAsked),
      difficulty: difficulty || "Medium",
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
    const {
      location,
      tag,
      driveType,
      difficulty,
      month,
      branch,
      maxCgpa,
      topic,
      search,
      company,
      limit,
      cursor,
    } = req.query;

    const filter = {
      isActive: true,
      ...(location ? { location } : {}),
      ...(tag ? { tags: tag } : {}),
      ...(driveType ? { driveType } : {}),
      ...(difficulty ? { difficulty } : {}),
      ...(month ? { expectedDriveMonth: month } : {}),
      ...(topic ? { topicsAsked: topic } : {}),
      ...(company ? { company: String(company) } : {}),
    };

    if (maxCgpa) {
      filter.minCGPA = { $lte: Number(maxCgpa) };
    }

    if (branch) {
      filter.$or = [
        { allowsAllBranches: true },
        { eligibleBranches: branch },
      ];
    }

    if (search) {
      const searchFilter = [
        { company: new RegExp(search, "i") },
        { title: new RegExp(search, "i") },
        { tags: new RegExp(search, "i") },
        { topicsAsked: new RegExp(search, "i") },
      ];
      filter.$and = filter.$or ? [{ $or: filter.$or }, { $or: searchFilter }] : [{ $or: searchFilter }];
      delete filter.$or;
    }

    const page = await buildDateCursorPageQuery(Job, filter, {
      cursor,
      limit,
      dateField: "createdAt",
    });
    const jobs = await Job.find(page.filter).sort(page.sort).limit(page.limit + 1);
    res.json(buildPage(jobs, page.limit, (job) => job.toJSON()));
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

router.post("/:id/apply", authMiddleware, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;
    const {
      applicantName,
      phone,
      college = null,
      graduationYear = null,
      resumeUrl,
    } = req.body;

    const existingApplication = await Application.findOne({
      user: userId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({ error: "Already applied to this job" });
    }

    if (!applicantName || !phone || !resumeUrl) {
      return res
        .status(400)
        .json({ error: "applicantName, phone and resumeUrl are required" });
    }

    const application = new Application({
      user: userId,
      job: jobId,
      applicantName,
      phone,
      college: typeof college === "string" && college.trim() ? college.trim() : null,
      graduationYear:
        typeof graduationYear === "number"
          ? graduationYear
          : graduationYear
          ? Number(graduationYear)
          : null,
      resumeUrl,
    });

    await application.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
