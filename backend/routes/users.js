const express = require("express");
const Application = require("../models/Application");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

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
