const express = require("express");
const Application = require("../models/Application");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const { serializeUser } = require("../utils/serializeUser");

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(serializeUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch user profile." });
  }
});

router.put("/me/profile", authMiddleware, async (req, res) => {
  try {
    const {
      college,
      branch,
      year,
      cgpa,
      leetcodeRating,
      problemsSolved,
      skills,
      projectCount,
      deployedProjectCount,
      hasInternship,
      openSourceContributions,
      systemDesign,
      comfortableTopics,
      weakTopics,
      targetCompanies,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.studentProfile = {
      college: college || "",
      branch: branch || "Other",
      year: Number(year || 3),
      cgpa: Number(cgpa || 0),
      leetcodeRating: leetcodeRating ? Number(leetcodeRating) : null,
      problemsSolved: Number(problemsSolved || 0),
      skills: Array.isArray(skills) ? skills : [],
      projectCount: Number(projectCount || 0),
      deployedProjectCount: Number(deployedProjectCount || 0),
      hasInternship: Boolean(hasInternship),
      openSourceContributions: Boolean(openSourceContributions),
      systemDesign: systemDesign || "none",
      comfortableTopics: Array.isArray(comfortableTopics) ? comfortableTopics : [],
      weakTopics: Array.isArray(weakTopics) ? weakTopics : [],
      targetCompanies: Array.isArray(targetCompanies) ? targetCompanies : [],
    };
    user.profileCompleted = true;

    await user.save();

    res.json(serializeUser(user));
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to save profile setup." });
  }
});

router.get("/:id/applications", authMiddleware, async (req, res) => {
  try {
    const requestedUserId = req.params.id;
    const currentUserId = req.user.id;

    if (requestedUserId !== currentUserId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const applications = await Application.find({ user: currentUserId })
      .sort({ appliedAt: -1 })
      .populate({ path: "job", select: "title company location tags companyLogo" })
      .lean();

    const result = applications.map((a) => ({
      id: a._id,
      appliedAt: a.appliedAt,
      applicantName: a.applicantName || null,
      phone: a.phone || null,
      college: a.college ?? null,
      graduationYear: typeof a.graduationYear === "number" ? a.graduationYear : null,
      resumeUrl: a.resumeUrl || null,
      job: a.job
        ? {
            id: a.job._id,
            title: a.job.title,
            company: a.job.company,
            location: a.job.location,
            tags: a.job.tags || [],
            companyLogo: typeof a.job.companyLogo !== "undefined" ? a.job.companyLogo : null,
          }
        : null,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
