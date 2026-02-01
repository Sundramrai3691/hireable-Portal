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
      .populate("job")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
