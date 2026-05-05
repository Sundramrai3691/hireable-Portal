const express = require("express");
const authMiddleware = require("../middleware/auth");
const Job = require("../models/Job");
const User = require("../models/User");
const {
  calculateReadinessScore,
  deriveReadinessInputFromProfile,
  buildCompanyFits,
} = require("../utils/readiness");

const router = express.Router();

router.post("/score", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const payload = {
      ...deriveReadinessInputFromProfile(user.studentProfile || {}),
      ...req.body,
    };

    payload.skillsCount = Number(payload.skillsCount || (user.studentProfile?.skills || []).length || 0);
    payload.projectCount = Number(payload.projectCount || user.studentProfile?.projectCount || 0);
    payload.deployedCount = Number(payload.deployedCount || user.studentProfile?.deployedProjectCount || 0);
    payload.cgpa = Number(payload.cgpa || user.studentProfile?.cgpa || 0);
    payload.branch = payload.branch || user.studentProfile?.branch || "Other";

    const result = calculateReadinessScore(payload);
    const targetCompanies =
      Array.isArray(payload.targetCompanies) && payload.targetCompanies.length
        ? payload.targetCompanies
        : user.studentProfile?.targetCompanies || [];

    const matchingCompanies = targetCompanies.length
      ? await Job.find({ company: { $in: targetCompanies } }).limit(5)
      : await Job.find({}).limit(5);

    const companyFits = buildCompanyFits(
      matchingCompanies.map((item) => item.toJSON()),
      { ...payload, totalScore: result.totalScore },
    );

    user.latestReadinessScore = result.totalScore;
    user.latestReadinessLevel = result.level.label;
    await user.save();

    res.json({
      ...result,
      companyFits,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to calculate readiness score." });
  }
});

module.exports = router;
