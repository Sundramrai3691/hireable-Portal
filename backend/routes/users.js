const express = require("express");
const Application = require("../models/Application");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const { serializeUser } = require("../utils/serializeUser");
const { buildDateCursorPageQuery, buildPage } = require("../utils/cursorPagination");

const router = express.Router();

function serializeApplication(application) {
  return {
    id: application._id,
    appliedAt: application.appliedAt,
    applicantName: application.applicantName || null,
    phone: application.phone || null,
    college: application.college ?? null,
    graduationYear: typeof application.graduationYear === "number" ? application.graduationYear : null,
    resumeUrl: application.resumeUrl || null,
    job: application.job
      ? {
          id: application.job._id,
          title: application.job.title,
          company: application.job.company,
          location: application.job.location,
          tags: application.job.tags || [],
          companyLogo: typeof application.job.companyLogo !== "undefined" ? application.job.companyLogo : null,
        }
      : null,
  };
}

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
    const { limit, cursor } = req.query;

    if (requestedUserId !== currentUserId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const page = await buildDateCursorPageQuery(
      Application,
      { user: currentUserId },
      { cursor, limit, dateField: "appliedAt" },
    );
    const applications = await Application.find(page.filter)
      .sort(page.sort)
      .limit(page.limit + 1)
      .populate({ path: "job", select: "title company location tags companyLogo" })
      .lean();

    res.json(buildPage(applications, page.limit, serializeApplication));
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

module.exports = router;
